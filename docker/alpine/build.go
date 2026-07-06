package main

import (
    "os"
	"fmt"
	"bufio"
	"os/exec"
	"strings"
)

func jsToMjs(from string, to string) {
	fr, err := os.Open(from)
	if err != nil {
		fmt.Println("Erro ao ler arquivo compilados", err)
	}
	fw, err := os.Create(to)
	if err != nil {
		fmt.Println("Erro ao criar o arquivo:", err)
		return
	}
	defer fr.Close()
	defer fw.Close()
	reader := bufio.NewScanner(fr)
	wiriter := bufio.NewWriter(fw)
	for reader.Scan() {
		line := reader.Text()
		if strings.Contains(line, "from") && strings.Contains(line, "import") {
			line = line[0: len(line) - 2] + ".mjs';"
		}
		_, err := wiriter.WriteString(line + "\n")
		if err != nil {
			fmt.Println("Erro ao escrever a linha:", err)
			return
		}
	}
	if err := reader.Err(); err != nil {
		fmt.Println("Erro ao ler arquivo compilados", err)
	}
	if err := wiriter.Flush(); err != nil {
		fmt.Println("Erro ao descarregar o buffer (Flush):", err)
	}
}

func main() {
	cmd := exec.Command("npx", "tsc")
	saida, err := cmd.Output()
	if err != nil {
		fmt.Println("Erro ao executar o comando:", err)
		return
	}
	fmt.Println(string(saida))

	origin := "/workspace/.build/"
	files, err := os.ReadDir(origin)
	if err != nil {
		fmt.Println("Erro ao ler arquivos compilados:", err)
	}

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
}
