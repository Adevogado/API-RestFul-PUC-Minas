const express = require("express");
const app = express();
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig.development);

app.use(express.json());

const lista_produtos = {
  produtos: [
    {
      id: 1,
      descricao: "Arroz parboilizado 5Kg",
      valor: 25.0,
      marca: "Tio João",
    },
    { id: 2, descricao: "Maionese 250gr", valor: 7.2, marca: "Helmans" },
    { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.5, marca: "Itambé" },
    {
      id: 4,
      descricao: "Batata Maior Palha 300gr",
      valor: 15.2,
      marca: "Chipps",
    },
    { id: 5, descricao: "Nescau 400gr", valor: 8.0, marca: "Nestlé" },
  ],
};

// Listar todos os produtos
app.get("/produtos", (req, res) => {
  res.json(lista_produtos.produtos);
});

app.get("/v2/produtos", (req, res) => {
  knex("produtos")
    .then((dados) => {
      res.json(dados);
    })
    .catch((err) => {
      res.json({ message: `Erro ao obter os produtos: ${err.message}` });
    });
});

// Obter um produto pelo ID
app.get("/produtos/:id", (req, res) => {
  const produtoId = parseInt(req.params.id);
  const produto = lista_produtos.produtos.find((p) => p.id === produtoId);

  if (!produto) {
    res.status(404).json({ error: "Produto não encontrado" });
  } else {
    res.json(produto);
  }
});

app.get("/v2/produtos/:id", (req, res) => {
  let id = req.params.id;
  knex("produtos")
    .where("id", id)
    .then((dados) => {
      res.json(dados);
    })
    .catch((err) => {
      res.json({ message: `Erro ao obter os produtos: ${err.message}` });
    });
});

// Adicionar um novo produto
app.post("/produtos", (req, res) => {
  const { id, descricao, valor, marca } = req.body;
  const novoProduto = { id, descricao, valor, marca };

  lista_produtos.produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

app.post("/v2/produtos", (req, res) => {
  console.log(req.body);

  knex("produtos")
    .insert(req.body, ["id"])
    .then((dados) => {
      if (dados.length > 0) {
        const id = dados[0].id;
        res.status(201).json({
          message: "produto adicionado com sucesso",
          data: { id },
        });
      }
    })
    .catch((error) => {
      res.json({ message: `Erro ao inserir produto: ${err.message}` });
    });
  // lista_produtos.produtos.push(novoProduto);
});

// Atualizar um produto
app.put("/produtos/:id", (req, res) => {
  const produtoId = parseInt(req.params.id);
  const { descricao, valor, marca } = req.body;

  const produto = lista_produtos.produtos.find((p) => p.id === produtoId);

  if (!produto) {
    res.status(404).json({ error: "Produto não encontrado" });
  } else {
    produto.descricao = descricao;
    produto.valor = valor;
    produto.marca = marca;
    res.json(produto);
  }
});

app.put("/v2/produtos/:id", (req, res) => {
  const produtoId = parseInt(req.params.id);
  const { descricao, valor, marca } = req.body;

  const produto = lista_produtos.produtos.find((p) => p.id === produtoId);

  if (!produto) {
    res.status(404).json({ error: "Produto não encontrado" });
  } else {
    produto.descricao = descricao;
    produto.valor = valor;
    produto.marca = marca;
    res.json(produto);
  }
});

// Excluir um produto
app.delete("/produtos/:id", (req, res) => {
  const produtoId = parseInt(req.params.id);
  const index = lista_produtos.produtos.findIndex((p) => p.id === produtoId);

  if (index === -1) {
    res.status(404).json({ error: "Produto não encontrado" });
  } else {
    const deletedProduct = lista_produtos.produtos.splice(index, 1);
    res.json(deletedProduct[0]);
  }
});

app.delete("/v2/produtos/:id", (req, res) => {
  const produtoId = parseInt(req.params.id);
  const index = lista_produtos.produtos.findIndex((p) => p.id === produtoId);

  if (index === -1) {
    res.status(404).json({ error: "Produto não encontrado" });
  } else {
    const deletedProduct = lista_produtos.produtos.splice(index, 1);
    res.json(deletedProduct[0]);
  }
});

app.listen(3000, () => {
  console.log("API em execução na porta 3000");
});
