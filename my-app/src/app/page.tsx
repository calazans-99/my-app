import Menu from "@/components/Menu/Menu";
import Image from "next/image";

export default function Home() {
    return (
        <div className="home-page p-8">
            <Image 
                src={'/assets/risco-titulo.png'}  
                alt={'ilustração'} 
                width={500} 
                height={2} 
                className="img-home mx-auto mb-6"
            />
            <main className="home-text text-center">
                <h1 className="text-4xl font-bold mb-4">PORTFÓLIO</h1>
                <p>
                    Este portfólio compila e exibe os resultados das avaliações acadêmicas dos alunos ao longo do curso,
                    proporcionando uma visão clara do desempenho e do progresso em diversas atividades.
                </p>
            </main>

            <Menu/>
        </div>
    );
}
