 package br.com.fiap.health.hear.config;

 import br.com.fiap.health.hear.model.*;
 import br.com.fiap.health.hear.repository.*;
 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.boot.CommandLineRunner;
 import org.springframework.context.annotation.Configuration;
 import org.springframework.context.annotation.Profile;

 import java.math.BigDecimal;
 import java.util.Arrays;
 import java.util.List;
 import java.util.Set;
 import java.util.HashSet;
 import java.util.Date;


 @Configuration
 @Profile("dev")
 public class DatabaseSeeder implements CommandLineRunner {

     @Autowired
     private EspecialidadeRepository especialidadeRepository;
     @Autowired
     private FeedbackRepository feedbackRepository;
     @Autowired
     private RegistroRepository registroRepository;
     @Autowired
     private RespostaRepository respostaRepository;
     @Autowired
     private UsuarioRepository usuarioRepository;

     @Override
     public void run(String... args) throws Exception {
//         List<Especialidade> especialidades = Arrays.asList(
//                 new Especialidade(null, "Neurologia", null),
//                 new Especialidade(null, "Clínica", null)
//         );
//         especialidadeRepository.saveAll(especialidades);
//
//         List<Usuario> pessoaList = Arrays.asList(
//                 new Usuario(null, "Kaue Caponero", "kaue@hotmail.com", "123", "11111111111", "https://avatars.githubusercontent.com/u/111543330?v=4"),
//                 new Usuario(null, "Natan Cruz", "natan@hotmail.com", "123", "11111111112", "https://avatars.githubusercontent.com/u/111809342?v=4"),
//                 new Usuario(null, "Stanley Bittar", "stanley@email.com", "123", "11111111115", "https://istoe.com.br/wp-content/uploads/2022/07/stanley-bittar.jpg?x55394")
//         );
//         usuarioRepository.saveAll(pessoaList);
//
//         Set<Especialidade> setEspecialidades = new HashSet<>(especialidades);
//
//         List<Registro> registroList = Arrays.asList(
//                 new Registro(null, "123456", "CRM", "SP", pessoaList.get(2), setEspecialidades),
//                 new Registro(null, "123457", "CRO", "SP", pessoaList.get(1), setEspecialidades)
//         );
//         registroRepository.saveAll(registroList);
//
//         List<Feedback> feedbackList = Arrays.asList(
//                 new Feedback(null, new Date(), "Médico muito competente", "Gostei do atendimento", new BigDecimal(5),  pessoaList.get(0), registroList.get(0), false, null, null, "elogio"),
//                 new Feedback(null, new Date(), "Gostei do atendimento. Consultório pode melhorar", "Consultório pequeno e ruim.", new BigDecimal(3),  pessoaList.get(1), registroList.get(0), true, null, null, "reclamacao")
//         );
//         feedbackRepository.saveAll(feedbackList);
     }

 }