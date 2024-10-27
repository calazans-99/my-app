import Link from "next/link";

export default function Menu() {
  return (
    <div>
      <nav>
        <ul className="menu">
          <li><Link href="/alunos/aluno/557964">Israel Vieira</Link></li>
          <li><Link href="/alunos/aluno/558470">Carlos Souza</Link></li>
          <li><Link href="/alunos/aluno/558575">Maria Brigidio</Link></li>
          <li><Link href="/alunos/aluno/556620">Marcus Calazans</Link></li>
        </ul>
      </nav>
    </div>
  );
}
