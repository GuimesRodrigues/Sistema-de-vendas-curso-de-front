import {Button,Dialog,DialogActions,DialogContent,DialogTitle,Stack,TextField,Typography} from "@mui/material";

export default function DialogDetalheVenda(props) {
    let clientes = props.clientes || []
    let produtos = props.produtos || []

    const dataVenda = props.dialogPreenchido.data
        ? new Date(props.dialogPreenchido.data).toLocaleString("pt-BR")
        : "Não informada";

    const cliente = clientes.find(item =>
        String(item.id) === String(props.dialogPreenchido.idCliente)
    )

    function buscarProduto(produto) {
        const item = produtos.find(produtoEncontrado =>
            String(produtoEncontrado.id) === String(produto.idProduto)
        )

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
                    <Typography variant="h6">Produtos</Typography>
                    {props.dialogPreenchido.produtos?.length
                        ? props.dialogPreenchido.produtos.map((produto, index) => (
                            <Stack
                                key={`${produto.idProduto}-${index}`}
                                direction="row"
                                spacing={2}
                            >
                                <TextField
                                    label="Produto"
                                    value={buscarProduto(produto)}
                                    fullWidth
                                    disabled
                                />
                                <TextField
                                    label="Quantidade"
                                    value={produto.quantidade}
                                    disabled
                                />
                            </Stack>
                        ))
                        : <Typography>Nenhum produto informado.</Typography>}
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