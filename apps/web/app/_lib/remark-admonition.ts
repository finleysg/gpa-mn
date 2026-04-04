import { visit } from "unist-util-visit"

const ADMONITION_TYPES = ["note", "warning", "tip", "danger"]

export function remarkAdmonition() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (tree: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        visit(tree, (node: any) => {
            if (
                node.type === "containerDirective" &&
                typeof node.name === "string" &&
                ADMONITION_TYPES.includes(node.name)
            ) {
                const data = node.data || (node.data = {})
                data.hName = "div"
                data.hProperties = {
                    dataAdmonition: "",
                    dataType: node.name,
                    className: ["admonition", `admonition-${node.name}`],
                }
            }
        })
    }
}
