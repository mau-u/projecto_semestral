package cl.dsy1104.tienda.config;
import cl.dsy1104.tienda.entity.*;
import cl.dsy1104.tienda.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;
@Configuration
public class DataInitializer {
    @Bean CommandLineRunner seedData(UsuarioRepository usuarios, CategoriaRepository categorias, ProductoRepository productos,
    PasswordEncoder encoder, @Value("${app.admin.name}") String adminName,
    @Value("${app.admin.email}") String adminEmail, @Value("${app.admin.password}") String adminPassword,
    @Value("${app.seller.name}") String sellerName, @Value("${app.seller.email}") String sellerEmail,
    @Value("${app.seller.password}") String sellerPassword) {
        return args -> {
            if (!usuarios.existsByEmailIgnoreCase(adminEmail)) {
                Usuario a=new Usuario();
                a.setNombre(adminName);
                a.setEmail(adminEmail.toLowerCase());
                a.setPassword(encoder.encode(adminPassword));
                a.setRol(Rol.ADMIN);
                a.setActivo(true);
                usuarios.save(a);
            }
            if (!usuarios.existsByEmailIgnoreCase(sellerEmail)) {
                Usuario s=new Usuario();
                s.setNombre(sellerName);
                s.setEmail(sellerEmail.toLowerCase());
                s.setPassword(encoder.encode(sellerPassword));
                s.setRol(Rol.VENDEDOR);
                s.setActivo(true);
                usuarios.save(s);
            }
            Map<String,Categoria> cats=new LinkedHashMap<>();
            String[][] categories= {
                {
                    "Tortas cuadradas","Sabores para celebrar en grande."
                }
                ,
                {
                    "Tortas circulares","Recetas clásicas para compartir."
                }
                ,
                {
                    "Postres individuales","Un gusto dulce para cualquier momento."
                }
                ,
                {
                    "Productos sin azúcar","Alternativas sin azúcar añadida."
                }
                ,
                {
                    "Pastelería tradicional","Recetas de siempre, hechas con cariño."
                }
                ,
                {
                    "Productos sin gluten","Opciones preparadas sin gluten."
                }
                ,
                {
                    "Productos veganos","Delicias sin ingredientes de origen animal."
                }
                ,
                {
                    "Tortas especiales","Diseños para tus momentos importantes."
                }
            }
            ;
            for(String[] row:categories) {
                Categoria c=categorias.findAll().stream().filter(x->x.getNombre().equals(row[0])).findFirst().orElseGet(()-> {
                    Categoria n=new Categoria(); n.setNombre(row[0]); n.setDescripcion(row[1]); return categorias.save(n);
                }
                );
                cats.put(row[0],c);
            }
            if(productos.count()==0) {
                Object[][] data= {
                    {
                        "Tortas cuadradas","Torta cuadrada de chocolate","Bizcocho de chocolate con capas de ganache y avellanas.",45000,12,"/img/TC001.jpg"
                    }
                    ,
                    {
                        "Tortas cuadradas","Torta cuadrada de frutas","Frutas frescas y crema chantilly sobre bizcocho de vainilla.",50000,8,"/img/TC002.jpg"
                    }
                    ,
                    {
                        "Tortas circulares","Torta circular de vainilla","Bizcocho de vainilla con crema pastelera.",40000,6,"/img/TT001.jpg"
                    }
                    ,
                    {
                        "Tortas circulares","Torta circular de manjar","Torta tradicional chilena con manjar y nueces.",42000,4,"/img/TT002.jpg"
                    }
                    ,
                    {
                        "Postres individuales","Mousse de chocolate","Postre individual cremoso de chocolate.",5000,20,"/img/PI001.jpg"
                    }
                    ,
                    {
                        "Postres individuales","Tiramisú clásico","Capas de café, mascarpone y cacao.",5500,16,"/img/PI002.jpg"
                    }
                    ,
                    {
                        "Productos sin azúcar","Torta sin azúcar de naranja","Torta de naranja sin azúcar añadida.",48000,5,"/img/PSA001.jpg"
                    }
                    ,
                    {
                        "Productos sin azúcar","Cheesecake sin azúcar","Cheesecake suave y cremoso.",47000,3,"/img/PSA002.jpg"
                    }
                    ,
                    {
                        "Pastelería tradicional","Empanada de manzana","Masa dorada rellena de manzanas especiadas.",3000,30,"/img/PT001.jpg"
                    }
                    ,
                    {
                        "Pastelería tradicional","Tarta de Santiago","Tarta tradicional de almendras.",6000,10,"/img/PT002.jpg"
                    }
                    ,
                    {
                        "Productos sin gluten","Brownie sin gluten","Brownie intenso elaborado sin gluten.",4000,18,"/img/PG001.jpg"
                    }
                    ,
                    {
                        "Productos sin gluten","Pan sin gluten","Pan suave y esponjoso.",3500,14,"/img/PG002.jpg"
                    }
                    ,
                    {
                        "Productos veganos","Torta vegana de chocolate","Torta preparada sin ingredientes de origen animal.",50000,7,"/img/PV001.jpg"
                    }
                    ,
                    {
                        "Productos veganos","Galletas veganas de avena","Galletas crujientes de avena.",4500,22,"/img/PV002.jpg"
                    }
                    ,
                    {
                        "Tortas especiales","Torta especial de cumpleaños","Torta personalizable para celebraciones.",55000,5,"/img/TE001.jpg"
                    }
                    ,
                    {
                        "Tortas especiales","Torta especial de boda","Torta para celebraciones especiales.",60000,2,"/img/TE002.jpg"
                    }
                }
                ;
                for(Object[] d:data) {
                    Producto p=new Producto();
                    p.setCategoria(cats.get((String)d[0]));
                    p.setNombre((String)d[1]);
                    p.setDescripcion((String)d[2]);
                    p.setPrecio(BigDecimal.valueOf((Integer)d[3]));
                    p.setStock((Integer)d[4]);
                    p.setImagenUrl((String)d[5]);
                    p.setActivo(true);
                    productos.save(p);
                }
            }
        }
        ;
    }
}
