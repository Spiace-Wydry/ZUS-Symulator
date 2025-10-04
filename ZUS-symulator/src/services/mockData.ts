export const pensionGroups = [
  {
    name: 'Poniżej minimalnej',
    average: 1200,
    percentage: 8,
    description:
      'Świadczeniobiorcy z niską aktywnością zawodową, poniżej 25 lat dla mężczyzn i 20 lat dla kobiet, bez prawa do gwarancji minimalnej emerytury',
  },
  {
    name: 'Minimalna',
    average: 1780,
    percentage: 15,
    description: 'Minimalna gwarantowana dla osób ze stażem i składkami',
  },
  {
    name: 'Średnia',
    average: 3500,
    percentage: 45,
    description: 'Najliczniejsza grupa w okolicach średniej krajowej',
  },
  {
    name: 'Powyżej średniej',
    average: 5200,
    percentage: 25,
    description: 'Wyższe świadczenia dzięki długiemu stażowi i wysokim zarobkom',
  },
  {
    name: 'Wysokie',
    average: 8500,
    percentage: 7,
    description: 'Najwyższe świadczenia, zwykle długi staż i brak przerw',
  },
]

export const facts: string[] = [
  'Najwyższą emeryturę w Polsce otrzymuje mieszkaniec woj. śląskiego - 24 500 zł, pracował 47 lat, bez zwolnień',
  'Średnia emerytura w Polsce wzrosła o 156% w ciągu ostatnich 15 lat',
  'Tylko 23% Polaków wie, ile wyniesie ich przyszła emerytura',
]

export function getRandomFact(): string {
  return facts[Math.floor(Math.random() * facts.length)]
}
