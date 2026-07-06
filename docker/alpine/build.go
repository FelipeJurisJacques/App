package main

import (
    "os"
	"fmt"
	"bytes"
	"bufio"
	"os/exec"
	"strings"
)

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

func jsToMjs(from string, to string) {
	var content strings.Builder
	file, err := os.Open(from)
	if err == nil {
		reader := bufio.NewScanner(file)
		for reader.Scan() {
			line := reader.Text()
			if strings.Contains(line, "from") && strings.Contains(line, "import") {
				line = line[0: len(line) - 2] + ".mjs';"
			}
			content.WriteString(line + "\n")
		}
		err = reader.Err()
		if err == nil {
			write(to, []byte(content.String()))
		} else {
			fmt.Println(err)
		}
	} else {
		fmt.Println(err)
	}
	defer file.Close()
}

func main() {
	fmt.Println("Compiling Type Script...")
	cmd := exec.Command("npx", "tsc")
	result, err := cmd.Output()
	if err == nil {
		fmt.Println(string(result))
		fmt.Println("Compiling ECMA Script...")
		origin := "/workspace/.build/"
		files, err := os.ReadDir(origin)
		if err == nil {
			for _, file := range files {
				if (!file.IsDir()) {
					name := file.Name()
					length := len(name)
					if (name[length - 2: length] == "js") {
						from := origin + name
						to := "/workspace/development/application/" + name[0: length - 3] + ".mjs"
						jsToMjs(from, to)
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
