'use client';

import { useState } from "react";
import AddUpdate from "./addUpdate";
import JournalView from "./journalView";

export default function TradeModal(props) {

    return (
        <>
            {
                props.addShow ?
                    <>
                        <AddUpdate data={props} />
                    </>
                    :
                    props.updateShow ?
                        <>
                            <AddUpdate data={props} />
                        </>
                        :
                        props.viewShow ?
                            <>
                                <JournalView data={props} />
                            </>
                            :
                            <>
                            </>
            }

        </>
    );
}
