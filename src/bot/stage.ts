import { AddItemSceneGenerator } from './scenes/AddItemSceneGenerator';
import { StockSceneGenerator } from './scenes/StockSceneGenerator';
import { Scenes } from 'telegraf';
import { Stage } from 'telegraf/typings/scenes';

export const setStageScenes = () => {

    const addItemSceneGenerator = new AddItemSceneGenerator();
    const stockSceneGenerator = new StockSceneGenerator();

    const addItemNameScene = addItemSceneGenerator.addItemNameScene();
    const addItemLinkScene = addItemSceneGenerator.addItemLinkScene();
    const addItemPriceScene = addItemSceneGenerator.addItemPriceScene();
    const addItemSelectorScene = addItemSceneGenerator.addItemSelectorScene();
    const addItemConfirmScene = addItemSceneGenerator.addItemConfirmScene();

    const stockScene = stockSceneGenerator.showStockScene();


    return new Stage<Scenes.SceneContext>([
        addItemNameScene,
        addItemLinkScene,
        addItemPriceScene,
        addItemSelectorScene,
        addItemConfirmScene,

        stockScene,
    ]);
}
