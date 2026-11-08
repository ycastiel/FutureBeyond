export const personagens = [
  { chave: 'bene', usuario: 'Benê', nome: 'Benê', senha: 'Alienados', rota: '/login/Bene' },
  { chave: 'leonardo', usuario: 'Leo.Fab', nome: 'Leonardo', senha: 'Berinjela', rota: '/login/Leonardo' },
  { chave: 'wolftheus', usuario: 'Wolftheus', nome: 'Wolftheus', senha: 'mat06!', rota: '/login/Wolftheus' },
] as const;

export type ChavePersonagem = (typeof personagens)[number]['chave'];

function normalizarUsuario(usuario: string): string {
  return usuario.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

export function reconhecerLogin(usuario: string, senha: string) {
  const normalizado = normalizarUsuario(usuario);
  return personagens.find(
    (personagem) => normalizarUsuario(personagem.usuario) === normalizado && personagem.senha === senha
  ) ?? null;
}

export function buscarPersonagem(chave: string | null) {
  return personagens.find((personagem) => personagem.chave === chave) ?? personagens[0];
}
