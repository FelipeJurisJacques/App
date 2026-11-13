package main

import "os"
import "fmt"
import "bytes"
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

func build(files []string) {
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
					jsContents := fmt.Sprintf(`export default class { [Symbol.toPrimitive](hint) { return hint === 'string' ? %s : null; } };`, svgRawContent)
					return api.OnLoadResult{
						Loader: api.LoaderJS,
						Contents: &jsContents,
					}, nil
				},
			)
		},
	}
	result := api.Build(api.BuildOptions{
		Write: true,
		Bundle: true,
		Plugins: []api.Plugin{
			cssPlugin,
			svgPlugin,
		},
		EntryPoints: files,
		JSX: api.JSXTransform,
		JSXFactory: "DLS.html",
		JSXFragment: "Fragment",
		LogLevel: api.LogLevelInfo,
		Inject: []string{"/workspace/global.ts"}, 
		Outdir: "/workspace/web/build/application",
		NodePaths: []string{"/workspace/node_modules"},
	})
	for _, err := range result.Errors {
		fmt.Println(err.Text)
	}
}

func main() {
	from := "/workspace/web/source/"
	files, err := os.ReadDir(from)
	if err == nil {
		compile := []string{}
		for _, file := range files {
			if (!file.IsDir()) {
				name := file.Name()
				length := len(name)
				if (name[length - 2: length] == "ts") {
					path := filepath.Join(from, name)
					compile = append(compile, path)
				}
			}
		}
		build(compile)
		fmt.Println("Compiling public files...")
		compileMarkups("/workspace/web/public/", "/workspace/web/build/")
		fmt.Println("Compiling build files...")
		compileMarkups("/workspace/web/build/", "/workspace/build/")
	} else {
		fmt.Println(err)
	}
}