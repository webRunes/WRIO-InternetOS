import {CharacterMetadata,EditorState, ContentBlock,ContentState} from 'draft-js'
import {List,Repeat, OrderedMap} from 'immutable'


const keyGen = () => 
    (new Date()).getTime().toString(32) + Math.random().toString(32);


function insertBlockAfterKey(blockMap : BlockMap, key: string, blocksToInsert : Array<ContentBlock>) {
    let wasInserted = false;
    const injectBlocks = (blocks) => blocksToInsert.reduce((acc,_block) => acc.set(_block.key,_block), blocks);
    const resultMap = blockMap.reduce((result,block) => {
        const inserted = result.set(block.key,block);
        if (block.key == key) {
            wasInserted = true
            return injectBlocks(inserted);
        } else {
            return inserted;
        }
    },new OrderedMap());
    if (wasInserted) {
        return resultMap;
    } else {
        console.log(`Block was not inserted beacuse block ${key} was not found`)
        return injectBlocks(resultMap);
    }
}



export default function insertAtomicBlock (editorState, entityKey, character, afterKey, insertEmpty=true) {

   
    const contentState = editorState.getCurrentContent();
    var charData = CharacterMetadata.create({ entity: entityKey });

    const newBlock = new ContentBlock({
      key: keyGen(),
      type: 'atomic',
      text: character,
      characterList: List(Repeat(charData, character.length))
    });

     const emptyBlock = new ContentBlock({
      key: keyGen(),
      type: 'unstyled',
      text: '',
      characterList: List()
    });

    const newBlockMap = insertBlockAfterKey(
                        contentState.getBlockMap(),
                        afterKey,
                        insertEmpty ? [newBlock, emptyBlock] : [newBlock]);
  
    return EditorState.push(
        editorState,
        ContentState
        .createFromBlockArray(newBlockMap.toArray())
        .set('selectionBefore', contentState.getSelectionBefore())
        .set('selectionAfter', contentState.getSelectionAfter())
    )
}
