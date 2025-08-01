package com.sistema.avaliacoes.model.enums;

public class StatusEnum {
    
    public enum StatusQuestao {
        PENDENTE(0, "Pendente"),
        APROVADO(1, "Aprovado"),
        CANCELADO(2, "Cancelado");

        private final int codigo;
        private final String descricao;

        StatusQuestao(int codigo, String descricao) {
            this.codigo = codigo;
            this.descricao = descricao;
        }

        public int getCodigo() {
            return codigo;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum StatusAvaliacao {
        PENDENTE(0, "Pendente"),
        APROVADO(1, "Aprovado"),
        CANCELADO(2, "Cancelado");

        private final int codigo;
        private final String descricao;

        StatusAvaliacao(int codigo, String descricao) {
            this.codigo = codigo;
            this.descricao = descricao;
        }

        public int getCodigo() {
            return codigo;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum StatusAplicacao {
        PENDENTE(0, "Pendente"),
        INICIADO(1, "Iniciado"),
        EM_ANDAMENTO(2, "Em Andamento"),
        CONCLUIDO(3, "Concluído");

        private final int codigo;
        private final String descricao;

        StatusAplicacao(int codigo, String descricao) {
            this.codigo = codigo;
            this.descricao = descricao;
        }

        public int getCodigo() {
            return codigo;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum TipoCorrecao {
        IA('I', "Inteligência Artificial"),
        MANUAL('M', "Manual");

        private final char codigo;
        private final String descricao;

        TipoCorrecao(char codigo, String descricao) {
            this.codigo = codigo;
            this.descricao = descricao;
        }

        public char getCodigo() {
            return codigo;
        }

        public String getDescricao() {
            return descricao;
        }
    }
}
