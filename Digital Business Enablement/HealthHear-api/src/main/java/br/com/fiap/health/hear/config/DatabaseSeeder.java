 package br.com.fiap.health.hear.config;

 import br.com.fiap.health.hear.model.*;
 import br.com.fiap.health.hear.repository.*;
 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.boot.CommandLineRunner;
 import org.springframework.context.annotation.Configuration;
 import org.springframework.context.annotation.Profile;

 import java.math.BigDecimal;
 import java.util.List;
 import java.util.Set;
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
         Especialidade especialidade1 = new Especialidade((long)(1), "Neurologia", null);
         Especialidade especialidade2 = new Especialidade((long)(2), "Clínica", null);
         especialidadeRepository.saveAll(List.of(especialidade1, especialidade2));

         Usuario usuario1 = new Usuario((long)(1), "Kaue Caponero", "kaue@hotmail.com", "123", "11111111111", "https://avatars.githubusercontent.com/u/111543330?v=4");
         Usuario usuario2 = new Usuario((long)(2), "Natan Cruz", "natan@hotmail.com", "123", "11111111112", "https://avatars.githubusercontent.com/u/111809342?v=4");
         Usuario usuario3 = new Usuario((long)(3), "Stanley Bittar", "stanley@email.com", "123", "11111111115", "https://istoe.com.br/wp-content/uploads/2022/07/stanley-bittar.jpg?x55394");
         usuarioRepository.saveAll(List.of(usuario1, usuario2, usuario3));

         Registro registro1 = new Registro((long)(1), "123456", "CRM", "SP", usuario3, Set.of(especialidade1));
         Registro registro2 = new Registro((long)(2), "123457", "CRO", "SP", usuario2, Set.of(especialidade2));
         registroRepository.saveAll(List.of(registro1, registro2));

         Feedback feedback1 = new Feedback((long)(1), new Date(), "Médico muito competente", "Voltarei outras vezes", new BigDecimal(5), usuario1, registro1, false, null, null, "elogio");
         Feedback feedback2 = new Feedback((long)(2), new Date(), "Atendimento ok.", "Consultório pode melhorar", new BigDecimal(3), usuario2, registro1, true, null, null, "reclamacao");
         feedbackRepository.saveAll(List.of(feedback1, feedback2));

         Resposta resposta1 = new Resposta((long)(1), new Date(), "Obrigada pela avaliação! Espero que volte mais vezes", usuario1, feedback1);
         Resposta resposta2 = new Resposta((long)(2), new Date(), "Que pena ouvir isso. Seguimos melhorando o consultório para melhor atendê-los.", usuario2, feedback2);
//         respostaRepository.saveAll(List.of(resposta1, resposta2));
     }

 }