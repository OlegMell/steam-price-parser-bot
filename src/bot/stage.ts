import { AddItemSceneGenerator } from './scenes/AddItemSceneGenerator';
import { StockSceneGenerator } from './scenes/StockSceneGenerator';
import { DeleteItemSceneGenerator } from './scenes/DeleteItemSceneGenerator';
import { Scenes } from 'telegraf';
import { ShowPricesSceneGenerator } from './scenes/ShowPricesSceneGenerator';

const { Stage } = Scenes;

export const setStageScenes = () => {

    const addItemSceneGenerator = new AddItemSceneGenerator();
    const stockSceneGenerator = new StockSceneGenerator();
    const deleteItemSceneGenerator = new DeleteItemSceneGenerator();
    const showPricesSceneGenerator = new ShowPricesSceneGenerator();

    const addItemNameScene = addItemSceneGenerator.addItemNameScene();
    const addItemLinkScene = addItemSceneGenerator.addItemLinkScene();
    const addItemPriceScene = addItemSceneGenerator.addItemPriceScene();
    const addItemSelectorScene = addItemSceneGenerator.addItemSelectorScene();
    const addItemConfirmScene = addItemSceneGenerator.addItemConfirmScene();
    const showPricesScene = showPricesSceneGenerator.showPricesScene();

    const stockScene = stockSceneGenerator.showStockScene();

    const deleteItemScene = deleteItemSceneGenerator.deleteItemScene();

    return new Stage<Scenes.SceneContext>([
        addItemNameScene,
        addItemLinkScene,
        addItemPriceScene,
        addItemSelectorScene,
        addItemConfirmScene,

        stockScene,

        deleteItemScene,

        showPricesScene
    ]);
}
