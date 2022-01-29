import Component from "./ComponentNode";

export default async function InstanceNode(node) {
	return await Component(node);
}