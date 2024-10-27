"use client";
import { Challenge, Checkpoint, GlobalSolution, Materia, TipoAluno } from '@/type';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from "react";
import Chart from 'chart.js/auto';

export default function Aluno({ params }: { params: { id: string } }) {
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
  const [novaMateria, setNovaMateria] = useState<Materia>({
    id: 0,
    nome: "",
    checkpoints: [],
    challenges: [],
    globalSolutions: [],
  });
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [addMateriaMode, setAddMateriaMode] = useState(false);
  const router = useRouter();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<'pie'> | null>(null);

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/alunos`);
        const data = await response.json();
        const alunoEncontrado = data.find((aluno: TipoAluno) => aluno.id === Number(params.id));

        if (alunoEncontrado) {
          setAluno(alunoEncontrado);
        } else {
          setErro("Aluno não encontrado");
        }
      } catch (error) {
        setErro("Erro ao buscar os dados do aluno.");
      } finally {
        setCarregando(false);
      }
    };

    fetchAluno();
  }, [params.id]);

  useEffect(() => {
    if (aluno.materias.length > 0 && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); 
      }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart<'pie'>(ctx, {
          type: 'pie',
          data: {
            labels: aluno.materias.map((materia) => materia.nome),
            datasets: [{
              label: 'Progresso dos Checkpoints',
              data: aluno.materias.map((materia) =>
                materia.checkpoints.length > 0
                  ? materia.checkpoints.reduce((acc, checkpoint) => acc + checkpoint.nota, 0) / materia.checkpoints.length
                  : 0
              ),
              backgroundColor: [
                'rgba(246, 53, 98, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)',
              ],
              borderColor: [
                '#f63562',
                '#36a2eb',
                '#ffce56',
                '#4bc0c0',
                '#9966ff',
                '#ff9f40',
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
            }
          }
        });
      }
    }
  }, [aluno]);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return <p>{erro}</p>;
  }

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleAddMateriaToggle = () => {
    setAddMateriaMode(!addMateriaMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const novoAluno = {
      ...aluno,
    };

    const response = await fetch(`/api/alunos/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoAluno),
    });

    if (response.ok) {
      setEditMode(false);
      router.push(`/alunos/${params.id}`);
    } else {
      console.error("Erro ao atualizar aluno");
    }
  };

  const handleAddMateria = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/alunos/${aluno.id}/materias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaMateria),
      });

      if (response.ok) {
        const materiaAdicionada = await response.json();
        setAluno((prev) => ({
          ...prev,
          materias: [...prev.materias, materiaAdicionada],
        }));
        setNovaMateria({ id: 0, nome: "", checkpoints: [], challenges: [], globalSolutions: [] });
        setAddMateriaMode(false);
      } else {
        console.error("Erro ao adicionar nova matéria");
      }
    } catch (error) {
      console.error("Erro ao adicionar nova matéria:", error);
    }
  };

  return (
    <div className='aluno'>
      <section className='exibir-aluno'>
        <div>
          <Link href="/" className='home-button'>Home</Link>
          <Image
            src={'/assets/risco-titulo.png'}
            alt={'ilustração'}
            width={500}
            height={2}
            className="img-home"
          />
          <div className="head-aluno">
            <Image
              src={aluno.foto ? (aluno.foto.startsWith('/assets') ? aluno.foto : `/assets/${aluno.foto}`) : '/assets/default-photo.png'}
              alt={`Foto de ${aluno.nome}`}
              width={200}
              height={100}
              className='foto-aluno'
            />
            <h1>{aluno.nome}</h1>
            <div className='descricao-aluno'>
              <p>Idade: {aluno.idade} anos</p>
              <p>{aluno.descricao}</p>
              <p className="flex justify-end font-bold text-[#f63562]">RM: {aluno.id}</p>
            </div>
          </div>
          <div className='skills-container'>
            <div className='skills'>
              <div className='skill'>
                <h2>Hard Skills</h2>
                <ul>
                  {aluno.hardSkills.map((skill: string) => (
                    <li key={skill}>• {skill}</li>
                  ))}
                </ul>
              </div>
              <div className='skill'>
                <h2>Soft Skills</h2>
                <ul>
                  {aluno.softSkills.map((skill: string) => (
                    <li key={skill}>• {skill}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grafico-container">
              <canvas ref={chartRef} id="grafico" width="300" height="300"></canvas>
            </div>
          </div>
          <div className='avaliacoes'>
            <h2>Checkpoints</h2>
            <div className='avaliacao'>
              {aluno.materias.map((materia: Materia) => (
                <div className="flex flex-col" key={materia.id}>
                  <h3>{materia.nome}</h3>
                  {materia.checkpoints.map((checkpoint: Checkpoint) => (
                    <div key={checkpoint.id}>
                      <p>Data: {checkpoint.data}</p>
                      <p>Nota: {checkpoint.nota}</p>
                      <p>Feedback: {checkpoint.feedback}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <h2>Challenge Sprints</h2>
            <div className='avaliacao'>
              {aluno.materias.map((materia: Materia) => (
                <div key={materia.id}>
                  <h3>{materia.nome}</h3>
                  {materia.challenges.map((challenge: Challenge) => (
                    <div key={challenge.id}>
                      <p>Nota: {challenge.nota}</p>
                      <p>Descrição: {challenge.descricao}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <h2>Global Solution</h2>
            <div className='avaliacao'>
              {aluno.materias.map((materia: Materia) => (
                <div key={materia.id}>
                  <h3>{materia.nome}</h3>
                  {materia.globalSolutions.map((gs: GlobalSolution) => (
                    <div key={gs.id}>
                      <p>Link: <a href={gs.link} target="_blank" rel="noopener noreferrer">{gs.link}</a></p>
                      <p>Nota: {gs.nota}</p>
                      <p>Descrição: {gs.descricao}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleEditToggle} className="botao-editar">
          {editMode ? "Cancelar" : "Editar"}
        </button>
        <button onClick={handleAddMateriaToggle} className="botao-editar">
          {addMateriaMode ? "Cancelar Nova Matéria" : "Nova Matéria"}
        </button>
      </section>

      {editMode && (
        <section className='editar-aluno'>
          <h1>Editar Aluno</h1>
          <form onSubmit={handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <td><label htmlFor="nomeAluno">Nome:</label></td>
                  <td>
                    <input
                      type="text"
                      id="nomeAluno"
                      value={aluno.nome}
                      onChange={(e) => setAluno({ ...aluno, nome: e.target.value })}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label htmlFor="descricaoAluno">Descrição:</label></td>
                  <td>
                    <textarea
                      id="descricaoAluno"
                      value={aluno.descricao}
                      onChange={(e) => setAluno({ ...aluno, descricao: e.target.value })}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label htmlFor="hardSkillsAluno">Hard Skills:</label></td>
                  <td>
                    <input
                      type="text"
                      id="hardSkillsAluno"
                      value={aluno.hardSkills.join(", ")}
                      onChange={(e) => setAluno({ ...aluno, hardSkills: e.target.value.split(", ") })}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label htmlFor="softSkillsAluno">Soft Skills:</label></td>
                  <td>
                    <input
                      type="text"
                      id="softSkillsAluno"
                      value={aluno.softSkills.join(", ")}
                      onChange={(e) => setAluno({ ...aluno, softSkills: e.target.value.split(", ") })}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit">Salvar Alterações</button>
          </form>
        </section>
      )}

      {addMateriaMode && (
        <section className='adicionar-materia'>
          <h1>Adicionar Nova Matéria</h1>
          <form onSubmit={handleAddMateria}>
            <table>
              <tbody>
                <tr>
                  <td><label htmlFor="nomeMateria">Nome da Matéria:</label></td>
                  <td>
                    <input
                      type="text"
                      id="nomeMateria"
                      value={novaMateria.nome}
                      onChange={(e) => setNovaMateria({ ...novaMateria, nome: e.target.value })}
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit">Adicionar Matéria</button>
          </form>
        </section>
      )}
    </div>
  );
}
