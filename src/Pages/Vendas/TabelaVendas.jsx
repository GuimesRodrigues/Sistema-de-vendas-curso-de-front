import { IconButton, Pagination, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Tooltip } from "@mui/material";
import Detalhes from '@mui/icons-material/LoupeOutlined';
export default function TabelaVendas(props) {
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Produtos</TableCell>
                <TableCell>Ações</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {props.vendas.map(venda =>
                <TableRow key={venda.id}>
                    <TableCell>{venda.id}</TableCell>
                    <TableCell>{venda.idCliente}</TableCell>
                    <TableCell>{new Date(venda.data).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>
                        {venda.produtos.map(produto =>
                            <div key={produto.idProduto}>
                                {produto.idProduto} (quantidade: {produto.quantidade})
                            </div>
                        )}
                    </TableCell>
                    <TableCell>
                        <Tooltip title="Detalhes da venda">
                            <IconButton onClick={()=>props.onAbrirDetalhes(venda.id)}>
                                <Detalhes color="success"/>
                            </IconButton>
                        </Tooltip>    
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
        <TableFooter>
            <TableRow>
                <TableCell colSpan={4}>
                    <Pagination
                        page={props.paginacao.pagina}
                        count={props.paginacao.totalPagina}
                        onChange={(evento, novaPagina) => props.onMudarPagina(novaPagina)}
                    />
                </TableCell>
            </TableRow>
        </TableFooter>
    </Table>
}