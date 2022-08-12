import { AddItemSceneGenerator } from './scenes/AddItemSceneGenerator';
import { StockSceneGenerator } from './scenes/StockSceneGenerator';
import { DeleteItemSceneGenerator } from './scenes/DeleteItemSceneGenerator';
import { Scenes } from 'telegraf';

const { Stage } = Scenes;

export const setStageScenes = () => {

    const addItemSceneGenerator = new AddItemSceneGenerator();
    const stockSceneGenerator = new StockSceneGenerator();
    const deleteItemSceneGenerator = new DeleteItemSceneGenerator();

    const addItemNameScene = addItemSceneGenerator.addItemNameScene();
    const addItemLinkScene = addItemSceneGenerator.addItemLinkScene();
    const addItemPriceScene = addItemSceneGenerator.addItemPriceScene();
    const addItemSelectorScene = addItemSceneGenerator.addItemSelectorScene();
    const addItemConfirmScene = addItemSceneGenerator.addItemConfirmScene();

    const stockScene = stockSceneGenerator.showStockScene();

    const deleteItemScene = deleteItemSceneGenerator.deleteItemScene();

    return new Stage<Scenes.SceneContext>([
        addItemNameScene,
        addItemLinkScene,
        addItemPriceScene,
        addItemSelectorScene,
        addItemConfirmScene,

        stockScene,

        deleteItemScene
    ]);
}
