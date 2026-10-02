import Link from "next/link";

export default function NotFound() {
  return <section className="section bg-white">
    <div className="container-site text-center">
      <h1 className="text-4xl font-bold mb-4">Página no encontrada</h1>
      <p className="mb-6">La página que buscas no existe o se ha trasladado.</p>
      <Link href="/es" className="btn btn-primary">Volver al inicio</Link>
    </div>
  </section>;
}
