/*
  elizabot.js v.1.1 - ELIZA JS library (N.Landsteiner 2005)
  Eliza is a mock Rogerian psychotherapist.
  Original program by Joseph Weizenbaum in MAD-SLIP for "Project MAC" at MIT.
  cf: Weizenbaum, Joseph "ELIZA - A Computer Program For the Study of Natural Language
	  Communication Between Man and Machine"
	  in: Communications of the ACM; Volume 9 , Issue 1 (January 1966): p 36-45.
  JavaScript implementation by Norbert Landsteiner 2005; <http://www.masserk.at>

  synopsis:

		 new ElizaBot( <random-choice-disable-flag> )
		 ElizaBot.prototype.transform( <inputstring> )
		 ElizaBot.prototype.getInitial()
		 ElizaBot.prototype.getFinal()
		 ElizaBot.prototype.reset()

  usage: var eliza = new ElizaBot();
		 var initial = eliza.getInitial();
		 var reply = eliza.transform(inputstring);
		 if (eliza.quit) {
			 // last user input was a quit phrase
		 }

		 // method `transform()' returns a final phrase in case of a quit phrase
		 // but you can also get a final phrase with:
		 var final = eliza.getFinal();

		 // other methods: reset memory and internal state
		 eliza.reset();

		 // to set the internal memory size override property `memSize':
		 eliza.memSize = 100; // (default: 20)

		 // to reproduce the example conversation given by J. Weizenbaum
		 // initialize with the optional random-choice-disable flag
		 var originalEliza = new ElizaBot(true);

  `ElizaBot' is also a general chatbot engine that can be supplied with any rule set.
  (for required data structures cf. "elizadata.js" and/or see the documentation.)
  data is parsed and transformed for internal use at the creation time of the
  first instance of the `ElizaBot' constructor.

  vers 1.1: lambda functions in RegExps are currently a problem with too many browsers.
			changed code to work around.
*/

import ElizaData from '../repository/PtBrData'
import ElizaKeywordEntry from '../type/ElizaKeywordEntry'

export default class ElizaBot extends ElizaData {
	public version: string;
	public noRandom: boolean;
	public capitalizeFirstLetter: boolean;
	public quit: boolean | undefined;
	public pres: Record<string, string>;
	public posts: Record<string, string>;
	public preExp: RegExp | undefined;
	public postExp: RegExp | undefined;
	public sentence: string | undefined;
	public lastchoice: number[][] | undefined;
	public mem: string[] | undefined;
	public memSize: number;
	public debug: boolean;
	private _dataParsed: boolean;

	constructor(noRandomFlag?: boolean) {
		super();
		this.version = "2.0 (adapted to OO by Felipe JJ)";
		this.noRandom = noRandomFlag ? true : false;
		this.capitalizeFirstLetter = true;
		this.quit = undefined;
		this.pres = {};
		this.posts = {};
		this.preExp = undefined;
		this.postExp = undefined;
		this.sentence = undefined;
		this.lastchoice = undefined;
		this.mem = undefined;
		this.memSize = 20;
		this.debug = false;
		this._dataParsed = false;
		this._init();
		this.reset();
	}

	reset(): void {
		this.quit = false;
		this.mem = new Array<string>();
		this.lastchoice = new Array<number[]>();
		for (let k = 0; k < this.elizaKeywords.length; k++) {
			this.lastchoice[k] = [];
			const rules = this.elizaKeywords[k][2];
			for (let i = 0; i < rules.length; i++) this.lastchoice[k][i] = -1;
		}
	}

	getInitial(): string {
		if (this.elizaInitials.length > 0) {
			return this.elizaInitials[Math.floor(Math.random() * this.elizaInitials.length)]
		}
		else {
			return ''
		}
	}

	getFinal(): string {
		if (this.elizaFinals.length > 0) {
			return this.elizaFinals[Math.floor(Math.random() * this.elizaFinals.length)];
		}
		else {
			return '';
		}
	}

	_getRuleIndexByKey(key: string): number {
		for (let k = 0; k < this.elizaKeywords.length; k++) {
			if (this.elizaKeywords[k][0] === key) return k;
		}
		return -1;
	}

	_postTransform(s: string): string {
		// final cleanings
		s = s.replace(/\s{2,}/g, ' ');
		s = s.replace(/\s+\./g, '.');
		if ((this.elizaPostTransforms) && (this.elizaPostTransforms.length)) {
			for (let i = 0; i < this.elizaPostTransforms.length; i += 2) {
				s = s.replace(this.elizaPostTransforms[i] as RegExp, this.elizaPostTransforms[i + 1] as string);
				(this.elizaPostTransforms[i] as RegExp).lastIndex = 0;
			}
		}
		// capitalize first char (v.1.1: work around lambda function)
		if (this.capitalizeFirstLetter) {
			const re = /^([a-z])/;
			const m = re.exec(s);
			if (m) {
				s = m[0].toUpperCase() + s.substring(1);
			}
		}
		return s;
	}

	_memSave(t: string): void {
		if (!this.mem) this.mem = [];
		this.mem.push(t);
		if (this.mem.length > this.memSize) this.mem.shift();
	}

	_memGet(): string {
		if (this.mem && this.mem.length) {
			if (this.noRandom) {
				return this.mem.shift() || '';
			}
			else {
				const n = Math.floor(Math.random() * this.mem.length);
				const rpl = this.mem[n];
				for (let i = n + 1; i < this.mem.length; i++) this.mem[i - 1] = this.mem[i];
				this.mem.pop();
				return rpl;
			}
		}
		else {
			return '';
		}
	}

	transform(e: unknown): string {
		let text = String(e);
		let rpl = '';
		this.quit = false;

		// unify text string
		text = text.toLowerCase();
		text = text.replace(/@#\$%\^&\*\(\)_\+=~`\{\[\}\]\|:;<>\/\\\t/g, ' ');
		text = text.replace(/\s+-+\s+/g, '.');
		text = text.replace(/\s*[,\.\?!;]+\s*/g, '.');
		text = text.replace(/\s*\bbut\b\s*/g, '.');
		text = text.replace(/\s{2,}/g, ' ');

		// split text in part sentences and loop through them
		const parts = text.split('.');
		for (let i = 0; i < parts.length; i++) {
			let part = parts[i];
			if (part !== '') {
				// check for quit expression
				for (let q = 0; q < this.elizaQuits.length; q++) {
					if (this.elizaQuits[q] === part) {
						this.quit = true;
						return this.getFinal();
					}
				}
				// preprocess (v.1.1: work around lambda function)
				if (this.preExp) {
					let m = this.preExp.exec(part);
					if (m) {
						let lp = '';
						let rp = part;
						while (m) {
							lp += rp.substring(0, m.index) + this.pres[m[1]];
							rp = rp.substring(m.index + m[0].length);
							m = this.preExp.exec(rp);
						}
						part = lp + rp;
					}
				}
				this.sentence = part;
				// loop trough keywords
				for (let k = 0; k < this.elizaKeywords.length; k++) {
					if (part.search(new RegExp('\\b' + this.elizaKeywords[k][0] + '\\b', 'i')) >= 0) {
						rpl = this._execRule(k);
					}
					if (rpl !== '') {
						return rpl;
					}
				}
			}
		}
		// nothing matched try mem
		rpl = this._memGet();
		// if nothing in mem, so try xnone
		if (rpl === '') {
			this.sentence = ' ';
			const k = this._getRuleIndexByKey('xnone');
			if (k >= 0) {
				rpl = this._execRule(k);
			}
		}
		// return reply or default string
		if (rpl !== '') {
			return rpl;
		} else {
			return 'I am at a loss for words.';
		}
	}

	_init(): void {
		if (this._dataParsed === false) {
			// parse data and convert it from canonical form to internal use
			// produce synonym list
			const synPatterns: Record<string, string> = {};
			if ((this.elizaSynons) && (typeof this.elizaSynons === 'object')) {
				for (const i in this.elizaSynons) synPatterns[i] = '(' + i + '|' + this.elizaSynons[i].join('|') + ')';
			}
			// check for keywords or install empty structure to prevent any errors
			if ((!this.elizaKeywords) || (typeof this.elizaKeywords.length === 'undefined')) {
				this.elizaKeywords = [['###', 0, [{ 0: '###', 1: [] }]]];
			}
			// 1st convert rules to regexps
			// expand synonyms and insert asterisk expressions for backtracking
			const sre = /@(\S+)/;
			const are = /(\S)\s*\*\s*(\S)/;
			const are1 = /^\s*\*\s*(\S)/;
			const are2 = /(\S)\s*\*\s*$/;
			const are3 = /^\s*\*\s*$/;
			const wsre = /\s+/g;
			for (let k = 0; k < this.elizaKeywords.length; k++) {
				const rules = this.elizaKeywords[k][2];
				this.elizaKeywords[k][3] = k; // save original index for sorting
				for (let i = 0; i < rules.length; i++) {
					const r = rules[i];
					// check mem flag and store it as decomp's element 2
					if (r[0].charAt(0) === '$') {
						let ofs = 1;
						while (r[0].charAt(ofs) === ' ') ofs++;
						r[0] = r[0].substring(ofs);
						r[2] = true;
					}
					else {
						r[2] = false;
					}
					// expand synonyms (v.1.1: work around lambda function)
					let m = sre.exec(r[0]);
					while (m) {
						const sp = (synPatterns[m[1]]) ? synPatterns[m[1]] : m[1];
						r[0] = r[0].substring(0, m.index) + sp + r[0].substring(m.index + m[0].length);
						m = sre.exec(r[0]);
					}
					// expand asterisk expressions (v.1.1: work around lambda function)
					if (are3.test(r[0])) {
						r[0] = '\\s*(.*)\\s*';
					}
					else {
						let mAre = are.exec(r[0]);
						if (mAre) {
							let lp = '';
							let rp = r[0];
							while (mAre) {
								lp += rp.substring(0, mAre.index + 1);
								if (mAre[1] !== ')') lp += '\\b';
								lp += '\\s*(.*)\\s*';
								if ((mAre[2] !== '(') && (mAre[2] !== '\\')) lp += '\\b';
								lp += mAre[2];
								rp = rp.substring(mAre.index + mAre[0].length);
								mAre = are.exec(rp);
							}
							r[0] = lp + rp;
						}
						let mAre1 = are1.exec(r[0]);
						if (mAre1) {
							let lp = '\\s*(.*)\\s*';
							if ((mAre1[1] !== ')') && (mAre1[1] !== '\\')) lp += '\\b';
							r[0] = lp + r[0].substring(mAre1.index - 1 + mAre1[0].length);
						}
						let mAre2 = are2.exec(r[0]);
						if (mAre2) {
							let lp = r[0].substring(0, mAre2.index + 1);
							if (mAre2[1] !== '(') lp += '\\b';
							r[0] = lp + '\\s*(.*)\\s*';
						}
					}
					// expand white space
					r[0] = r[0].replace(wsre, '\\s+');
					wsre.lastIndex = 0;
				}
			}
			// now sort keywords by rank (highest first)
			this.elizaKeywords.sort(this._sortKeywords.bind(this));

			// and compose regexps and refs for pres and posts
			if ((this.elizaPres) && (this.elizaPres.length)) {
				const a: string[] = new Array<string>();
				for (let i = 0; i < this.elizaPres.length; i += 2) {
					a.push(this.elizaPres[i]);
					this.pres[this.elizaPres[i]] = this.elizaPres[i + 1];
				}
				this.preExp = new RegExp('\\b(' + a.join('|') + ')\\b');
			}
			else {
				// default (should not match)
				this.preExp = /####/;
				this.pres['####'] = '####';
			}
			if ((this.elizaPosts) && (this.elizaPosts.length)) {
				const a: string[] = new Array<string>();
				for (let i = 0; i < this.elizaPosts.length; i += 2) {
					a.push(this.elizaPosts[i]);
					this.posts[this.elizaPosts[i]] = this.elizaPosts[i + 1];
				}
				this.postExp = new RegExp('\\b(' + a.join('|') + ')\\b');
			}
			else {
				// default (should not match)
				this.postExp = /####/;
				this.posts['####'] = '####';
			}
			// check for elizaQuits and install default if missing
			if ((!this.elizaQuits) || (typeof this.elizaQuits.length === 'undefined')) {
				this.elizaQuits = [];
			}
			// done
			this._dataParsed = true;
		}
	}

	_sortKeywords(a: ElizaKeywordEntry, b: ElizaKeywordEntry): number {
		return b[1] - a[1];
	}

	_execRule(k: number): string {
		const rule = this.elizaKeywords[k];
		const decomps = rule[2];
		const paramre = /\(([0-9]+)\)/;
		for (let i = 0; i < decomps.length; i++) {
			if (!this.sentence) continue;
			const m = this.sentence.match(decomps[i][0]);
			if (m != null) {
				const reasmbs = decomps[i][1];
				const memflag = decomps[i][2];
				let ri = (this.noRandom) ? 0 : Math.floor(Math.random() * reasmbs.length);
				if (this.lastchoice) {
					if (((this.noRandom) && (this.lastchoice[k][i] > ri)) || (this.lastchoice[k][i] === ri)) {
						ri = ++this.lastchoice[k][i];
						if (ri >= reasmbs.length) {
							ri = 0;
							this.lastchoice[k][i] = -1;
						}
					}
					else {
						this.lastchoice[k][i] = ri;
					}
				}
				let rpl = reasmbs[ri];
				if (this.debug) {
					alert('match:\nkey: ' + this.elizaKeywords[k][0] +
						'\nrank: ' + this.elizaKeywords[k][1] +
						'\ndecomp: ' + decomps[i][0] +
						'\nreasmb: ' + rpl +
						'\nmemflag: ' + memflag);
				}
				if (rpl.search(/^goto /i) === 0) {
					const ki = this._getRuleIndexByKey(rpl.substring(5));
					if (ki >= 0) {
						return this._execRule(ki);
					}
				}

				// substitute positional params (v.1.1: work around lambda function)
				let m1 = paramre.exec(rpl);
				if (m1) {
					let lp = '';
					let rp = rpl;
					while (m1) {
						let param = m[parseInt(m1[1])];
						// postprocess param
						if (this.postExp) {
							let m2 = this.postExp.exec(param);
							if (m2) {
								let lp2 = '';
								let rp2 = param;
								while (m2) {
									lp2 += rp2.substring(0, m2.index) + this.posts[m2[1]];
									rp2 = rp2.substring(m2.index + m2[0].length);
									m2 = this.postExp.exec(rp2);
								}
								param = lp2 + rp2;
							}
						}
						lp += rp.substring(0, m1.index) + param;
						rp = rp.substring(m1.index + m1[0].length);
						m1 = paramre.exec(rp);
					}
					rpl = lp + rp;
				}
				rpl = this._postTransform(rpl);
				if (memflag) {
					this._memSave(rpl);
				}
				else {
					return rpl;
				}
			}
		}
		return '';
	}
}
