import * as statisticsService from "../../services/statisticsService.js";

const getStatsData = async (user) => {
  return {
    nofAnswers: await statisticsService.nofAnswers(user.id),
    nofCorrectAnswers: await statisticsService.nofCorrectAnswers(user.id),
    nofAnswersCreatedBy: await statisticsService.nofAnswersCreatedByUser(user.id),
    usersWithMostAnswers: await statisticsService.findFiveUsersWithMostAnswers(),
  }
};

const getStatistics = async ({ render, user }) => {
  const stats = await getStatsData(user);
  render("statistics.eta", stats);
};

export { getStatistics };
