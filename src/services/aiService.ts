export const analisarDieta = async (pergunta: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const p = pergunta.toLowerCase();
  
  if (p.includes('massa') || p.includes('hipertrofia')) {
    return "Para ganho de massa, recomendo focar em 2g de proteína por kg corporal e superávit calórico limpo.";
  }
  if (p.includes('pré') || p.includes('pre treino')) {
    return "Sugestão rápida: Banana com aveia e mel, consumidos de 45 a 60 minutos antes de treinar.";
  }
  if (p.includes('pós') || p.includes('pos treino')) {
    return "No pós-treino, a prioridade é proteína e carboidratos. Um shake de Whey ou frango com arroz são ideais.";
  }
  if (p.includes('emagrecer') || p.includes('perder peso') || p.includes('secar')) {
    return "Para definição e perda de gordura, o segredo é o déficit calórico com proteínas altas.";
  }
  return "Analisei sua solicitação e cruzei com seus dados de treino. Aqui está o ajuste nutricional ideal.";
};