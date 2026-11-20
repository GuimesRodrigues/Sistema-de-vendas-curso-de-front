import {
Alert,Button,Dialog,DialogActions,DialogContent,DialogTitle,Stack,TextField,Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DialogProduto from "./DialogProduto";
import DialogCliente from "./DialogCliente";
import api from "../../services/api";

dayjs.extend(customParseFormat);

export default function DialogDetalheVenda(props) {
    let clientes = props.clientes || []
    let produtos = props.produtos || []

    const [erro, setErro] = useState(null)
    const [itens, setItens] = useState([])
    const [dialogProdutos, setDialogProdutos] = useState (false)
    const [dialogClientes, setDialogClientes] = useState(false)
    const [clienteSelecionado, setClienteSelecionado] = useState(null)
    const [produtosDetalhe, setProdutosDetalhe] = useState([])
    const [erroProdutos, setErroProdutos] = useState(null)

    useEffect(() => {
        const venda = props.dialogPreenchido

        if (!venda?.produtos?.length) {
            setProdutosDetalhe([])
            setErroProdutos(null)
            return
        }

        let ativo = true
        const produtosNaoCarregados = venda.produtos.filter(item =>
            !produtos.some(produto =>
                String(produto.id) === String(item.idProduto)
            )
        )

        Promise.all(produtosNaoCarregados.map(async item => {
            const retorno = await api.get(`/produtos/${item.idProduto}`)
            return retorno.data
        }))
            .then(produtosEncontrados => {
                if (ativo) {
                    setProdutosDetalhe(produtosEncontrados)
                    setErroProdutos(null)
                }
            })
            .catch(() => {
                if (ativo) {
                    setErroProdutos("Não foi possível carregar os preços de todos os produtos.")
                }
            })

        return () => {
            ativo = false
        }
    }, [props.dialogPreenchido, produtos])

    function selecionarProduto(produto) {
        setItens([
            ...itens,
            {
                idProduto: produto.id,
                nomeProduto: produto.nome,
                valorProduto: produto.valor,
                quantidade: 1
            }
        ])
    }

    function alterarProduto(index, campo, valor) {
        setItens(itens.map((item, itemIndex) =>
            itemIndex === index
                ? { ...item, [campo]: valor }
                : item
        ))
    }

    function removerProduto(index) {
        setItens(itens.filter((item, itemIndex) => itemIndex !== index))
    }

    function mostrarValor(valor) {
        if (valor == null || !Number.isFinite(Number(valor))) {
            return "Preço indisponível"
        }

        return Number(valor).toLocaleString("pt-BR", {
            maximumFractionDigits: 2
        })
    }

    function calcularSubtotal(valor, quantidade) {
        if (
            valor == null ||
            !Number.isFinite(Number(valor)) ||
            !Number.isFinite(Number(quantidade))
        ) {
            return null
        }

        return Number(valor) * Number(quantidade)
    }

    function buscarProdutoDados(itemVenda) {
        return [...produtos, ...produtosDetalhe].find(produto =>
            String(produto.id) === String(itemVenda.idProduto)
        )
    }

    const totalCadastro = itens.reduce((total, item) =>
        total + (calcularSubtotal(item.valorProduto, item.quantidade) || 0), 0
    )
    const precosCadastroDisponiveis = itens.every(item =>
        calcularSubtotal(item.valorProduto, item.quantidade) !== null
    )

    function enviar(formdata) {
        const textoData = formdata.get("data")
        const textoHorario = formdata.get("horario")

        if (!textoData) {
            setErro(<Alert severity="error">Informe a data da venda.</Alert>)
            return
        }

        if (!textoHorario) {
            setErro(<Alert severity="error">Informe o horário da venda.</Alert>)
            return
        }

        const dataInformada = dayjs(
            `${textoData} ${textoHorario}`,
            "DD/MM/YYYY HH:mm",
            true
        )

        if (!dataInformada.isValid()) {
            setErro(<Alert severity="error">Informe uma data e horário válidos.</Alert>)
            return
        }

        const venda = {
            idCliente: formdata.get("idCliente"),
            produtos: itens.map(item => ({
                idProduto: item.idProduto,
                quantidade: Number(item.quantidade)
            })),
            data: dataInformada.toISOString()
        }

        if (!venda.idCliente) {
            setErro(<Alert severity="error">Selecione um cliente.</Alert>)
            return
        }

        if (!itens.length) {
            setErro(<Alert severity="error">Adicione pelo menos um produto.</Alert>)
            return
        }

        if (itens.some(item => !item.idProduto)) {
            setErro(<Alert severity="error">Selecione todos os produtos.</Alert>)
            return
        }

        if (itens.some(item => Number(item.quantidade) < 1)) {
            setErro(<Alert severity="error">A quantidade deve ser maior que zero.</Alert>)
            return
        }

        setErro(null)
        props.onEnviar(venda)
    }

    if (!props.dialogPreenchido) {
        return (
            <>
                <Dialog open fullWidth maxWidth="sm" onClose={props.onFechar}>
                    <form action={enviar}>
                    <DialogTitle align="center">
                        Cadastro de Venda
                    </DialogTitle>
                    <DialogContent>
                        {erro}
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="Data"
                                    name="data"
                                    placeholder="DD/MM/AAAA"
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Horário"
                                    name="horario"
                                    placeholder="HH:mm"
                                    required
                                    fullWidth
                                />
                            </Stack>
                            <input
                                type="hidden"
                                name="idCliente"
                                value={clienteSelecionado?.id || ""}
                            />
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="Cliente"
                                    value={clienteSelecionado
                                        ? `${clienteSelecionado.nome} (${clienteSelecionado.id})`
                                        : ""}
                                    fullWidth
                                    disabled
                                />
                                <Button
                                    variant="outlined"
                                    type="button"
                                    onClick={() => setDialogClientes(true)}
                                >
                                    Selecionar cliente
                                </Button>
                            </Stack>

                            <Typography variant="h6">Produtos</Typography>

                            {itens.map((item, index) => (
                                <Stack
                                    key={index}
                                    spacing={1}
                                >
                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            label="Produto"
                                            value={produtos.find(produto =>
                                                String(produto.id) === String(item.idProduto)
                                            )?.nome || item.nomeProduto}
                                            fullWidth
                                            disabled
                                        />
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            type="button"
                                            onClick={() => removerProduto(index)}
                                        >
                                            Remover
                                        </Button>
                                    </Stack>
                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            label="Quantidade"
                                            type="number"
                                            value={item.quantidade}
                                            onChange={event =>
                                                alterarProduto(index, "quantidade", event.target.value)
                                            }
                                            fullWidth
                                            inputProps={{ min: 1 }}
                                        />
                                        <TextField
                                            label="Valor unitário"
                                            value={mostrarValor(item.valorProduto)}
                                            fullWidth
                                            disabled
                                        />
                                        <TextField
                                            label="Subtotal"
                                            value={mostrarValor(calcularSubtotal(
                                                item.valorProduto,
                                                item.quantidade
                                            ))}
                                            fullWidth
                                            disabled
                                        />
                                    </Stack>
                                </Stack>
                            ))}

                            <TextField
                                label="Total da venda"
                                value={precosCadastroDisponiveis
                                    ? mostrarValor(totalCadastro)
                                    : "Preço indisponível"}
                                fullWidth
                                disabled
                            />

                            <Button
                                variant="outlined"
                                type="button"
                                onClick={()=>setDialogProdutos(true)}
                                disabled={!produtos.length}
                            >
                                Adicionar produto
                            </Button>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="warning"
                            type="button"
                            onClick={props.onFechar}
                        >
                            Cancelar
                        </Button>
                        <Button variant="contained" color="primary" type="submit">
                            Cadastrar
                        </Button>
                    </DialogActions>
                    </form>
                </Dialog>
                <DialogProduto
                    open={dialogProdutos}
                    produtos={produtos}
                    onFechar={() => setDialogProdutos(false)}
                    onSelecionar={selecionarProduto}
                />
                <DialogCliente
                    open={dialogClientes}
                    onFechar={() => setDialogClientes(false)}
                    onSelecionar={setClienteSelecionado}
                />
            </>
        )
    }

    const dataVenda = props.dialogPreenchido.data &&
        dayjs(props.dialogPreenchido.data).isValid()
        ? dayjs(props.dialogPreenchido.data).format("DD/MM/YYYY HH:mm")
        : "Não informada";

    const cliente = clientes.find(item =>
        String(item.id) === String(props.dialogPreenchido.idCliente)
    )

    const produtosDaVenda = props.dialogPreenchido.produtos || []
    const totalDetalhe = produtosDaVenda.reduce((total, item) => {
        const produto = buscarProdutoDados(item)
        const subtotal = calcularSubtotal(produto?.valor, item.quantidade)
        return total + (subtotal || 0)
    }, 0)
    const precosDetalheDisponiveis = produtosDaVenda.every(item => {
        const produto = buscarProdutoDados(item)
        return calcularSubtotal(produto?.valor, item.quantidade) !== null
    })

    function buscarProduto(produto) {
        const item = buscarProdutoDados(produto)

        return item
            ? `${item.nome} (${item.id})`
            : produto.idProduto || "Não informado"
    }

    return (
        <Dialog open fullWidth maxWidth="sm" onClose={props.onFechar}>
            <DialogTitle align="center">
                Detalhes da venda
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="ID da venda"
                        value={props.dialogPreenchido.id || "Não informado"}
                        fullWidth
                        disabled
                    />
                    <TextField
                        label="Cliente"
                        value={cliente
                            ? `${cliente.nome} (${cliente.id})`
                            : props.dialogPreenchido.idCliente || "Não informado"}
                        fullWidth
                        disabled
                    />
                    <TextField
                        label="Data da venda"
                        value={dataVenda}
                        fullWidth
                        disabled
                    />
                    {erroProdutos &&
                        <Alert severity="error">{erroProdutos}</Alert>}
                    <Typography variant="h6">Produtos</Typography>
                    {props.dialogPreenchido.produtos?.length
                        ? produtosDaVenda.map((produto, index) => {
                            const produtoDados = buscarProdutoDados(produto)
                            const subtotal = calcularSubtotal(
                                produtoDados?.valor,
                                produto.quantidade
                            )

                            return (
                                <Stack key={`${produto.idProduto}-${index}`} spacing={1}>
                                    <TextField
                                        label="Produto"
                                        value={buscarProduto(produto)}
                                        fullWidth
                                        disabled
                                    />
                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            label="Quantidade"
                                            value={produto.quantidade}
                                            fullWidth
                                            disabled
                                        />
                                        <TextField
                                            label="Valor unitário"
                                            value={mostrarValor(produtoDados?.valor)}
                                            fullWidth
                                            disabled
                                        />
                                        <TextField
                                            label="Subtotal"
                                            value={mostrarValor(subtotal)}
                                            fullWidth
                                            disabled
                                        />
                                    </Stack>
                                </Stack>
                            )
                        })
                        : <Typography>Nenhum produto informado.</Typography>}
                    <TextField
                        label="Total da venda"
                        value={precosDetalheDisponiveis
                            ? mostrarValor(totalDetalhe)
                            : "Preço indisponível"}
                        fullWidth
                        disabled
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={props.onFechar}>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
}