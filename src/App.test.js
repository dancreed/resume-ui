import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Daniel Creed chatbot title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Daniel Creed Q&A ChatBot/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders question input field', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Ask a question/i);
  expect(inputElement).toBeInTheDocument();
});

test('renders ask button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /submit question/i });
  expect(buttonElement).toBeInTheDocument();
});

test('renders answer textarea', () => {
  render(<App />);
  const textareaElement = screen.getByPlaceholderText(/The AI's answer will appear here/i);
  expect(textareaElement).toBeInTheDocument();
});
