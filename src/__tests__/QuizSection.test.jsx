import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuizSection from '../components/quiz/QuizSection';
import { QUIZ_ANSWER_DELAY_MS } from '../constants';
import quiz from '../data/quiz.json';
import professors from '../data/professors.json';
import directions from '../data/directions.json';

describe('QuizSection', () => {
  it('renders the first question', () => {
    const onResult = vi.fn();
    render(
      <QuizSection
        quiz={quiz}
        professors={professors}
        directions={directions}
        onResult={onResult}
      />,
    );

    expect(screen.getByText(quiz.questions[0].text)).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    const onResult = vi.fn();
    render(
      <QuizSection
        quiz={quiz}
        professors={professors}
        directions={directions}
        onResult={onResult}
      />,
    );

    expect(screen.getByText(`1 / ${quiz.questions.length}`)).toBeInTheDocument();
  });

  it('calls onResult after answering all questions', async () => {
    const onResult = vi.fn();
    const user = userEvent.setup();

    render(
      <QuizSection
        quiz={quiz}
        professors={professors}
        directions={directions}
        onResult={onResult}
      />,
    );

    // Answer all questions by clicking the first option each time
    for (let i = 0; i < quiz.questions.length; i++) {
      const firstOption = quiz.questions[i].options[0];
      const button = await screen.findByText(firstOption.text);
      await user.click(button);
      await new Promise((resolve) => setTimeout(resolve, QUIZ_ANSWER_DELAY_MS + 50));
    }

    expect(onResult).toHaveBeenCalled();
    const result = onResult.mock.calls[0][0];
    expect(result).toHaveProperty('direction');
    expect(result).toHaveProperty('topResults');
    expect(result.topResults[0].strengths.length).toBeGreaterThan(0);
  });
});
