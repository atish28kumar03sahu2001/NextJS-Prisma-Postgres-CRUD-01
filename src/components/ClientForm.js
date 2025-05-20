'use client';

import { useEffect, useState } from 'react';
import { addExpense, updateExpense, deleteExpense } from '@/actions';

export default function ClientForm() {

  const [expenses, setExpenses] = useState([]);

    useEffect(() => {
    async function loadExpenses() {
        const res = await fetch('/api/expenses');
        const data = await res.json();
        setExpenses(data);
    }
    loadExpenses();
    }, []);


  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    if (formData.get('id')) {
      await updateExpense(formData);
    } else {
      await addExpense(formData);
    }

    form.reset();
    form.querySelector('button').textContent = 'Add Expense';
    form.querySelector('input[name="id"]').value = '';

    const res = await fetch('/api/expenses');
    const data = await res.json();
    setExpenses(data);
  }

  function fillForm(expense) {
    const form = document.querySelector('#expense-form');
    form.name.value = expense.expName;
    form.price.value = expense.expPrice;
    form.description.value = expense.expDesc;
    form.date.value = expense.expDate.split('T')[0];
    form.id.value = expense.id;

    form.querySelector('button').textContent = 'Update Expense';
    form.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleDelete(id) {
    const formData = new FormData();
    formData.append('id', id);

    await deleteExpense(formData);

    const res = await fetch('/api/expenses');
    const data = await res.json();
    setExpenses(data);
  }


  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <form id="expense-form" onSubmit={handleSubmit} style={formStyle}>
        <input type="hidden" name="id" />
        <input type="text" name="name" placeholder="Expense Name" required />
        <input type="number" name="price" placeholder="Price" required />
        <textarea name="description" placeholder="Description" required></textarea>
        <input type="date" name="date" required />
        <button type="submit">Add Expense</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td style={tdStyle}>{exp.expName}</td>
              <td style={tdStyle}>${exp.expPrice.toFixed(2)}</td>
              <td style={tdStyle}>{exp.expDesc}</td>
              <td style={tdStyle}>{new Date(exp.expDate).toLocaleDateString()}</td>
              <td style={tdStyle}>
                <button type="button" onClick={() => fillForm(exp)}>Update</button>
                <button type="button" style={{ background: 'red', color: 'white' }} onClick={() => handleDelete(exp.id)} >
                    Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginBottom: '2rem',
};

const thStyle = {
  border: '1px solid #ccc',
  padding: '0.5rem',
  backgroundColor: '#f9f9f9',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '0.5rem',
};