import ClientForm from '@/components/ClientForm';

export default async function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Expense Tracker</h1>
      <ClientForm />
    </main>
  );
}

