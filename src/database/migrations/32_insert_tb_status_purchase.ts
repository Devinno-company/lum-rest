import Knex from 'knex';

export function up(knex: Knex) {
    const status = [
        {cd_status: 'pending', nm_status: 'Pendente', ds_status: 'O usuário ainda não completou o processo de pagamento.'},
        {cd_status: 'approved', nm_status: 'Aprovado', ds_status: 'O pagamento foi aprovado e credenciado.'},
        {cd_status: 'authorized', nm_status: 'Autorizado', ds_status: 'O pagamento foi autorizado, mas ainda não foi capturado.'},
        {cd_status: 'in_process', nm_status: 'Em processo', ds_status: 'O pagamento está sendo revisto.'},
        {cd_status: 'in_mediation', nm_status: 'Em mediação', ds_status: 'Os usuários iniciaram uma disputa.'},
        {cd_status: 'reject', nm_status: 'Rejeitado', ds_status: 'O pagamento foi rejeitado. O usuário pode tentar novamente o pagamento.'},
        {cd_status: 'cancelled', nm_status: 'Cancelado', ds_status: 'O pagamento foi cancelado por uma das partes ou porque o tempo de pagamento expirou.'},
        {cd_status: 'refunded', nm_status: 'Reembolsado', ds_status: 'O pagamento foi reembolsado ao usuário.'},
        {cd_status: 'charged_back', nm_status: 'Estornado', ds_status: 'Foi feito um estorno no cartão de crédito do comprador.'}
    ];

    return knex.insert(status).into('tb_status_purchase');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_status_purchase');
}