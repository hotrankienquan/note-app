import JoditEditor from "jodit-react";
import { useRef, useState } from "react";

interface IProps {
	getContent:(value: string) => void;
}

export const Editor = ({getContent}: IProps) => {
	const editor = useRef(null);
	const [content, setContent] = useState('');


	return (
		<JoditEditor
			ref={editor}
			value={content}
			onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
			onChange={newContent => {
				getContent(newContent)
            }}
		/>
	);
};