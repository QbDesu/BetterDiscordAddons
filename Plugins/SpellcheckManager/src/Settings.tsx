import React, {useState} from 'react';
import { WebpackModules } from "@zlibrary";
import { FormItem } from '@discord/forms';
import { Flex } from '@discord/components';

const localStorage = WebpackModules.getByProps("ObjectStorage").impl;
const SpellcheckStore = WebpackModules.getByProps('setLearnedWords');
const Titles = WebpackModules.getByProps("titleDefault");

function DeleteButton(props){
    return (<button class="bd-button bd-button-danger" {...props}>
        <svg fill="#FFFFFF" viewBox="0 0 24 24" width="20px" height="20px">
            <path fill="none" d="M0 0h24v24H0V0z"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path><path fill="none" d="M0 0h24v24H0z"></path>
        </svg>
    </button>)
}

export default function Settings(){
    const [spellcheckStoreState,setSpellcheckStoreState] = useState(localStorage.get('SpellcheckStore')||{enabled:true,learnedWords:[]});
    const learnedWords: string[] = spellcheckStoreState.learnedWords;

    function removeWord(word){
        setSpellcheckStoreState((state)=>{
            const newState = {
                enabled: state.enabled,
                learnedWords: learnedWords.filter(w=>w!=word)
            }
            localStorage.set('SpellcheckStore',newState);
            SpellcheckStore.setLearnedWords(new Set(newState.learnedWords));
            return newState;
        })
    }

    return <React.Fragment>
        <FormItem title="Learned Words">
            {
                learnedWords.length
                ?learnedWords.map((word)=>
                    <Flex align={Flex.Align.START}>
                        <Flex.Child wrap={false}>
                            <div className={Titles?.title}>{word}</div>
                        </Flex.Child>
                        <Flex grow={0} shrink={0}>
                            <DeleteButton onClick={()=>{removeWord(word)}} />
                        </Flex>
                    </Flex>
                )
                :<div className={Titles?.title}>No entries</div>
            }
        </FormItem>
    </React.Fragment>
}