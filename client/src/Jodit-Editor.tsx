import JoditEditor from "jodit-react";
import { useRef, useState } from "react";

interface IProps {
	getContent:(value: string) => void;
	contentInit?: string;
}

export const Editor = ({getContent, contentInit}: IProps) => {
	const editor = useRef(null);
	const [content, setContent] = useState(contentInit ?? '');


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