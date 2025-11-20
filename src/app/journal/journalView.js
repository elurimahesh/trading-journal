'use client';

import { useState } from "react";

export default function JournalView(props) {

    return (
        <>
            <div className="fixed left-0 top-0 z-99999 flex h-screen w-full justify-center bg-[#111928]/70 px-4 py-5">
                <div className="max-h-[98vh] w-full max-w-[730px] overflow-clip overflow-y-auto rounded-xl">
                    <div className="relative m-auto rounded-xl border border-stroke bg-gray-2 p-4 shadow-3 border-dark-3 bg-gray-dark shadow-card sm:p-8 xl:p-10">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Modal Title</h2>
                        <p className="mb-6 text-gray-700 dark:text-gray-300">
                            This is the modal content.
                        </p>
                        <button
                            onClick={props.data.onViewHide}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl font-bold"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                        <button
                            onClick={props.data.onViewHide}
                            className="mt-2 bg-[#5750F1] text-white font-semibold px-4 py-2 rounded hover:bg-[#5750F1]"
                        >
                            Cancel
                        </button>
                    </div>

                </div>
            </div>

        </>
    );
}
