# 🧪 Como Testar o Modal de Detalhes

## Problema Atual
Se o modal não está aparecendo, pode ser por um destes motivos:

### 1. **Verificar no Console do Navegador**
Abra o DevTools (F12) e veja se aparece:
```
Modal de Detalhes aberto para mentor: [Nome do Mentor]
```

Se aparecer essa mensagem mas o modal não aparecer visualmente, pode ser um problema de CSS/z-index.

### 2. **Dados Mock Automáticos**
O modal agora tem dados MOCK automáticos! Mesmo que seus mentores não tenham os campos extras, ele vai mostrar dados de exemplo:

- ✅ **Gênero**: "Homem" (padrão)
- ✅ **CPF**: "***.***.***-**" (padrão)
- ✅ **DDD**: Extraído do telefone ou "11"
- ✅ **CEP**: Baseado no estado
- ✅ **Competências**: ["Marketing/Vendas", "Finanças", "Comportamento Empreendedor"]
- ✅ **Áreas de Conhecimento**: Baseadas na área do mentor
- ✅ **Motivação**: "Compartilhar Conhecimento e Experiências"
- ✅ **Experiência**: Texto gerado automaticamente

### 3. **Verificar se o Botão Funciona**
O botão "Detalhes" está assim:
```jsx
<Button
  onClick={() => setDetalhesId(dados.mentor.id)}
  variant="outline"
  className="h-8 px-3 text-xs flex items-center gap-1 whitespace-nowrap"
>
  <Eye className="w-3 h-3" />
  Detalhes
</Button>
```

### 4. **Z-Index Alto**
O modal agora usa `z-[9999]` e `z-[10000]` para garantir que apareça na frente de tudo.

### 5. **Fundo Escuro Mais Visível**
O overlay tem `bg-black/60` (60% de opacidade) para ser bem visível.

## 🎯 Teste Rápido

1. Abra a lista de mentores
2. Clique em "Detalhes" em qualquer mentor
3. Abra o Console (F12) e veja se tem a mensagem de log
4. O modal deve aparecer com:
   - Fundo escuro cobrindo toda a tela
   - Card branco centralizado
   - Botão X no canto superior direito
   - Estatísticas em cards coloridos
   - Informações em 2 colunas

## 🐛 Debug

Se ainda não funcionar, verifique:

1. **Console do navegador** - Tem erros em vermelho?
2. **React DevTools** - O componente `MentorDetalhesModal` está sendo renderizado?
3. **State** - `detalhesId` tem um valor quando clica no botão?

## 💡 Solução Alternativa

Se o problema persistir, podemos:
1. Verificar se há conflito com outros modais
2. Ajustar o Portal para renderizar o modal
3. Verificar estilos CSS globais que possam estar interferindo

---

**Status atual**: ✅ Modal implementado com dados mock automáticos e z-index alto

