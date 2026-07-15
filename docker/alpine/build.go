package main

import "os"
import "fmt"
import "bytes"
import "os/exec"
import "strings"
import "encoding/json"
import "path/filepath"
import "github.com/evanw/esbuild/pkg/api"

func write(path string, content []byte) {
	_, err := os.Stat(path)
	if err == nil {
		current, err := os.ReadFile(path)
		if err == nil {
			if bytes.Equal(content, current) {
				return
			}
		} else {
			fmt.Println(err)
			return
		}
	}
	err = os.WriteFile(path, content, 0644)
	if err != nil {
		fmt.Println("Erro ao escrever arquivo:", err)
	}
}

func compileMarkups(from string, to string) {
	to = strings.TrimSuffix(to, "/")
	from = strings.TrimSuffix(from, "/")
	err := os.MkdirAll(to, 0755)
	if err == nil {
		files, err := os.ReadDir(from)
		if err == nil {
			for _, file := range files {
				name := file.Name()
				path := from + "/" + name
				if (file.IsDir()) {
					compileMarkups(path, to + "/" + name)
				} else {
					content, err := os.ReadFile(path)
					if err == nil {
						write(to + "/" + name, content)
					} else {
						fmt.Println(err)
					}
				}
			}
		} else {
			fmt.Println(err)	
		}
	} else {
		fmt.Println(err)
	}
}

func main() {
	cssPlugin := api.Plugin{
		Name: "css-stylesheet-loader",
		Setup: func(build api.PluginBuild) {
			build.OnResolve(api.OnResolveOptions{Filter: `\.css$`},
				func(args api.OnResolveArgs) (api.OnResolveResult, error) {
					return api.OnResolveResult{
						Namespace: "css-stylesheet-namespace",
						Path: filepath.Join(args.ResolveDir, args.Path),
					}, nil
				},
			)
			build.OnLoad(
				api.OnLoadOptions{
					Filter: `.*`,
					Namespace: "css-stylesheet-namespace",
				},
				func(args api.OnLoadArgs) (api.OnLoadResult, error) {
					bytes, err := os.ReadFile(args.Path)
					if err != nil {
						return api.OnLoadResult{}, err
					}
					cssRawContent, err := json.Marshal(string(bytes))
					if err != nil {
						return api.OnLoadResult{}, err
					}
					jsContents := fmt.Sprintf(`export default class extends CSSStyleSheet { constructor() { super(); this.replaceSync(%s); } };`, cssRawContent)
					return api.OnLoadResult{
						Loader: api.LoaderJS,
						Contents: &jsContents,
					}, nil
				},
			)
		},
	}
	svgPlugin := api.Plugin{
		Name: "svg-class-loader",
		Setup: func(build api.PluginBuild) {
			build.OnResolve(api.OnResolveOptions{Filter: `\.svg$`},
				func(args api.OnResolveArgs) (api.OnResolveResult, error) {
					return api.OnResolveResult{
						Namespace: "svg-namespace",
						Path: filepath.Join(args.ResolveDir, args.Path),
					}, nil
				},
			)
			build.OnLoad(
				api.OnLoadOptions{
					Filter: `.*`,
					Namespace: "svg-namespace",
				},
				func(args api.OnLoadArgs) (api.OnLoadResult, error) {
					bytes, err := os.ReadFile(args.Path)
					if err != nil {
						return api.OnLoadResult{}, err
					}
					svgRawContent, err := json.Marshal(string(bytes))
					if err != nil {
						return api.OnLoadResult{}, err
					}
					jsContents := fmt.Sprintf(`export default class { toString() { return %s; } };`, svgRawContent)
					return api.OnLoadResult{
						Loader: api.LoaderJS,
						Contents: &jsContents,
					}, nil
				},
			)
		},
	}

	method := ""
	if len(os.Args) > 1 {
		method = os.Args[1]
	}
	from := "/workspace/source/"
	if method == "check" || method == "compile" {
		cmd := exec.Command("npx", "tsc")
		result, err := cmd.CombinedOutput()
		if err != nil {
			message := string(result)
			if message != "" {
				lines := strings.Split(message, "\n")
				fmt.Println(lines[0])
			}
			method = ""
		}
	}
	files, err := os.ReadDir(from)
	if err == nil {
		for _, file := range files {
			if (!file.IsDir()) {
				name := file.Name()
				length := len(name)
				if (name[length - 2: length] == "ts") {
					path := filepath.Join(from, name)
					if method == "build" || method == "compile" {
						result := api.Build(api.BuildOptions{
							Write: true,
							Bundle: true,
							Plugins: []api.Plugin{
								cssPlugin,
								svgPlugin,
							},
							JSX: api.JSXTransform,
							JSXFactory: "DLS.html",
							JSXFragment: "Fragment",
							LogLevel: api.LogLevelInfo,
							EntryPoints: []string{path},
							Outdir: "/workspace/build/",
							Inject: []string{"/workspace/global.ts"}, 
						})
						for _, err := range result.Errors {
							fmt.Println(err.Text)
						}
					}
				}
			}
		}
		if method == "build" || method == "compile" {
			fmt.Println("Compiling public files...")
			compileMarkups("/workspace/public/", "/workspace/build/")
		}
	} else {
		fmt.Println(err)
	}
}