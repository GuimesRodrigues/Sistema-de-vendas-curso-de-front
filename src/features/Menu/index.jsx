import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import Venda from '@mui/icons-material/Storefront';
import { useNavigate, Link } from "react-router";
export default function Menu(props){
    const navegador = useNavigate()
    const paginas = [
        {rotulo:"Produtos", caminho:"/produtos"},
        {rotulo:"Vendas", caminho:"/vendas"},
        {rotulo:"Cliente", caminho:"/cliente"}
    ]
    return <>
        <AppBar position="static">
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Toolbar >
                    <IconButton onClick={() => navegador("/home")} >
                        <Venda fontSize="large"/>
                    </IconButton>
                    <Typography sx={{ml:2}} variant="h4" >Sistema de vendas</Typography>
                    <Box sx={{ display: "flex", flexGrow: 0.7, justifyContent: "space-around" }}>
                        {paginas.map(pagina=>
                            <Button
                            key={pagina.caminho}
                            to={pagina.caminho}
                            component={Link}
                            sx={{color: "white", textTransform: "none" }}>
                                <Typography variant="h4">
                                    {pagina.rotulo}
                                </Typography>
                            </Button> 
                        )}
                    </Box>
                </Toolbar>
            </Box>
        </AppBar>
    </>
}