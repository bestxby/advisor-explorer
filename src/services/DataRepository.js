import quiz from '../data/quiz.json';
import professors from '../data/professors.json';
import directions from '../data/directions.json';
import roadmap from '../data/roadmap.json';

/**
 * DataRepository — Single Source of Truth for Data Retrieval.
 *
 * Encapsulates all static local asset loading.
 * Provides clean decoupling: if tomorrow we migrate to a real REST/GraphQL API
 * or local indexedDB storage, we only need to refactor this single class.
 */
export class DataRepository {
  /**
   * Retrieves the personalized quiz configuration and weights.
   * @returns {object} Quiz schema.
   */
  static getQuiz() {
    return quiz;
  }

  /**
   * Retrieves all verified academic professors and profiles.
   * @returns {array} Array of professor objects.
   */
  static getProfessors() {
    return professors;
  }

  /**
   * Retrieves all standard research directions (directions and detail data).
   * @returns {array} Array of direction schemas.
   */
  static getDirections() {
    return directions;
  }

  /**
   * Retrieves the personalized roadmap steps for a specific direction.
   * @param {string} directionId - ID of the matched direction.
   * @returns {object|null} Roadmap steps array or null.
   */
  static getRoadmap(directionId) {
    return roadmap[directionId] || null;
  }
}
