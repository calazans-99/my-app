"use client";

import { TipoAluno } from "@/type";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CadAlunos() {
  const navigate = useRouter();

  const [aluno, setAluno] = useState<TipoAluno>({
    id: 0,
    nome: "",
    idade: 0,
    foto: "",
    descricao: "",
    hardSkills: [],
    softSkills: [],
    materias: [],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!aluno.nome || !aluno.idade || !aluno.foto || !aluno.descricao) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/alunos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aluno),
      });

      if (response.ok) {
        setAluno({
          id: 0,
          nome: "",
          idade: 0,
          foto: "",
          descricao: "",
          hardSkills: [],
          softSkills: [],
          materias: [],
        });
        alert("Aluno cadastrado com sucesso!");
        
        navigate.push("/alunos");
      } else {
        alert("Erro ao cadastrar aluno!");
      }
    } catch (error) {
      console.error("Erro ao cadastrar aluno: ", error);
      alert("Erro ao cadastrar aluno, tente novamente mais tarde.");
    }
  };

  return (
    <div>
      <h1>Cadastro de Alunos</h1>

      <div>
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
          <div>
            <label htmlFor="idNome" className="block mb-2 text-sm font-medium">
              Nome do Aluno:
            </label>
            <input
              type="text"
              name="nome"
              id="idNome"
              value={aluno.nome}
              onChange={(e) => setAluno({ ...aluno, nome: e.target.value })}
              placeholder="Nome do aluno"
              required
              className="text-gray-600"
            />
          </div>
          <div>
            <label htmlFor="idIdade" className="block mb-2 text-sm font-medium">
              Idade do Aluno:
            </label>
            <input
              type="number"
              name="idade"
              id="idIdade"
              value={aluno.idade}
              onChange={(e) => setAluno({ ...aluno, idade: parseInt(e.target.value) })}
              placeholder="Idade do aluno"
              required
              className="text-gray-600"
            />
          </div>
          <div>
            <label htmlFor="idFoto" className="block mb-2 text-sm font-medium">
              Foto do Aluno:
            </label>
            <input
              type="text"
              name="foto"
              id="idFoto"
              value={aluno.foto}
              onChange={(e) => setAluno({ ...aluno, foto: e.target.value })}
              placeholder="URL da foto do aluno"
              required
              className="text-gray-600"
            />
          </div>
          <div>
            <label htmlFor="idDescricao" className="block mb-2 text-sm font-medium">
              Descrição:
            </label>
            <textarea
              name="descricao"
              id="idDescricao"
              value={aluno.descricao}
              onChange={(e) => setAluno({ ...aluno, descricao: e.target.value })}
              placeholder="Descrição do aluno"
              required
              className="text-gray-600"
            />
          </div>
          <div>
            <label htmlFor="idHardSkills" className="block mb-2 text-sm font-medium">
              Hard Skills:
            </label>
            <input
              type="text"
              name="hardSkills"
              id="idHardSkills"
              value={aluno.hardSkills.join(", ")}
              onChange={(e) => setAluno({ ...aluno, hardSkills: e.target.value.split(", ") })}
              placeholder="Hard skills, separadas por vírgula"
              className="text-gray-600"
            />
          </div>
          <div>
            <label htmlFor="idSoftSkills" className="block mb-2 text-sm font-medium">
              Soft Skills:
            </label>
            <input
              type="text"
              name="softSkills"
              id="idSoftSkills"
              value={aluno.softSkills.join(", ")}
              onChange={(e) => setAluno({ ...aluno, softSkills: e.target.value.split(", ") })}
              placeholder="Soft skills, separadas por vírgula"
              className="text-gray-600"
            />
          </div>
          <div>
            <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
