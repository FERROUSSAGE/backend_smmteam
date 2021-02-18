const ApiError = require('../../error/apiError');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { Order } = require('../../models');

const { SPREADSHEET_ID } = require('../../utils/consts');

const credentions = require('../../client-secret.json');

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

const copySheet = async (indexSheet) => {
    const sheet = doc.sheetsByIndex[indexSheet];

    const index = (await sheet.copyToSpreadsheet(SPREADSHEET_ID)).data.index;
    await doc.loadInfo();
    return index;
}


const getPatternHeader = (date) => {
    const dayMonth = date.toLocaleString('ru-RU', { day: 'numeric', month: 'long' }).toUpperCase();
    return {
        smmcraft: `ВЫПОЛНЕННЫЕ ЗАКАЗЫ SMM CRAFT ${ dayMonth }`,
        streamboost: `ВЫПОЛНЕННЫЕ ЗАКАЗЫ STREAMBOOST ${ dayMonth }`
    };
}

const getInfoOrders = async (date) => {
    date = date.toLocaleDateString();
    const orders = await Order.findAll({ where: { date } });

    const oList = orders.map(order => {
        return {
            id: order.getDataValue('idSmmcraft'),
            pm: order.getDataValue('payment') || '',
            cw: order.getDataValue('countViews') || '',
            pc: order.getDataValue('cost'),
            sp: order.getDataValue('spend'),
            sn: order.getDataValue('socialNetwork')
        }
    });

    // const amountOfStream = orders.filter(order => order.getDataValue('countViews'))
    //     .reduce(acc, order => acc + +order.getDataValue('cost'), 0);

    return {
        list: oList,
        // amountOfStream,
        paid: orders.length
    }
    
}

class SpreadsheetController{
    async accessSpreadsheet(req, res, next){

        const { name } = req.body;

        if(!name)
            return next(ApiError.internal('Не было передано имя пользователя!'));
    
        const date = new Date();

        await doc.useServiceAccountAuth({
            client_email: credentions.client_email,
            private_key: credentions.private_key,
        });
        
        await doc.loadInfo();
        
        const newSheetIndex = (await copySheet(doc.sheetCount - 1));
        const newSheet = await doc.sheetsByIndex[newSheetIndex];
        await newSheet.updateProperties({ title: date.toLocaleDateString('ru-RU') });

        await newSheet.loadCells();

        const orders = await getInfoOrders(date);

        orders.list.forEach((order, i) => 
            Object.values(order)
                .forEach((item, j) => {
                    newSheet.getCell(i + 2, j).value = item;
                })
        );

        newSheet.getCell(0, 8).value = name;
        newSheet.getCell(0,0).value = getPatternHeader(date).smmcraft;
        newSheet.getCell(0, 11).value = getPatternHeader(date).streamboost;
        newSheet.getCell(23, 8).value = orders.paid;
        // newSheet.getCell(2, 8).value = orders.amountOfStream;

        await newSheet.saveUpdatedCells();
    }

}

module.exports = new SpreadsheetController();