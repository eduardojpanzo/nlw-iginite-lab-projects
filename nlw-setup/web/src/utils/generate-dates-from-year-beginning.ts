import dayjs from "dayjs";

export function generateDatesFromYearBeginning() {
  const firstDayOfTheYear = dayjs().startOf("year");
  const today = new Date();

  const dates = [];
  let compareDate = firstDayOfTheYear;

  while (compareDate.isBefore(today)) {
    dates.push(compareDate.toDate());

    compareDate = compareDate.add(1, "day");
  }

  return dates;
}

//Melhoria da aplicação: criar uma nova tabela de usuario, que será atrelado ao primeiro dia que entra na aplicação e comece a contar os dia do abito aprtir daí e separar como no github, quando completar um mês(ou 2 ou 3 ou 6 ou 12)
//Ou trazer o ano todo como no gitHub e o dia atual
