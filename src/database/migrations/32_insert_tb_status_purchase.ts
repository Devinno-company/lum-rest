import Knex from 'knex';

export function up(knex: Knex) {
    const status = [
        {sg_status: 'PEN', nm_status: 'Pendente', ds_status: 'O usuário ainda não completou o processo de pagamento.'},
        {sg_status: 'APR', nm_status: 'Aprovado', ds_status: 'O pagamento foi aprovado e credenciado.'},
        {sg_status: 'AUT', nm_status: 'Autorizado', ds_status: 'O pagamento foi autorizado, mas ainda não foi capturado.'},
        {sg_status: 'PRO', nm_status: 'Em processo', ds_status: 'O pagamento está sendo revisto.'},
        {sg_status: 'MED', nm_status: 'Em mediação', ds_status: 'Os usuários iniciaram uma disputa.'},
        {sg_status: 'REJ', nm_status: 'Rejeitado', ds_status: 'O pagamento foi rejeitado. O usuário pode tentar novamente o pagamento.'},
        {sg_status: 'CAN', nm_status: 'Cancelado', ds_status: 'O pagamento foi cancelado por uma das partes ou porque o tempo de pagamento expirou.'},
        {sg_status: 'REE', nm_status: 'Reembolsado', ds_status: 'O pagamento foi reembolsado ao usuário.'},
        {sg_status: 'EST', nm_status: 'Estornado', ds_status: 'Foi feito um estorno no cartão de crédito do comprador.'}
    ];

    return knex.insert(status).into('tb_status_purchase');
}

export function down(knex: Knex) {
    return knex.delete().from('tb_status_purchase');
}