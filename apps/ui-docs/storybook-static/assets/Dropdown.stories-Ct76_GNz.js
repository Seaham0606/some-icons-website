import{j as e}from"./jsx-runtime-u17CrQMm.js";import{D as m,S as p,a as S,b as c}from"./index-m2GsfvbU.js";import"./iframe-aZuiXQCe.js";import"./preload-helper-PPVm8Dsz.js";const r=e.jsx(p,{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"md",padding:"2"}),o=e.jsx(p,{iconName:"arrow-down-triangle",iconStyle:"fill",iconSize:"md",padding:"2"}),f={title:"Dropdown",component:m,tags:["autodocs"],decorators:[g=>e.jsx("div",{style:{maxWidth:320,width:"100%"},children:e.jsx(g,{})})],argTypes:{leadingSlot:{control:!1},trailingSlot:{control:!1},panelSlot:{control:!1},status:{control:"select",options:["default","error"]}}},n={name:"Empty (no leading)",args:{empty:!0,children:"Dropdown",trailingSlot:o}},a={name:"Leading + trailing (SomeIcon)",args:{empty:!1,children:"Dropdown",leadingSlot:r,trailingSlot:o}},t={name:"Slot placeholders",args:{empty:!1,children:"Dropdown",showLeading:!0,leadingSlot:e.jsx(c,{}),trailingSlot:e.jsx(c,{})}},l={args:{empty:!1,status:"error",children:"Dropdown",leadingSlot:r,trailingSlot:o}},s={args:{empty:!1,disabled:!0,children:"Dropdown",leadingSlot:r,trailingSlot:o}},i={args:{empty:!1,expanded:!0,children:"Dropdown",leadingSlot:r,trailingSlot:o,panelSlot:e.jsx(S,{})}},d={args:{empty:!1,fullWidth:!0,children:"Dropdown",leadingSlot:r,trailingSlot:o}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "Empty (no leading)",
  args: {
    empty: true,
    children: "Dropdown",
    trailingSlot: trailingChevron
  }
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "Leading + trailing (SomeIcon)",
  args: {
    empty: false,
    children: "Dropdown",
    leadingSlot: slotIcon,
    trailingSlot: trailingChevron
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "Slot placeholders",
  args: {
    empty: false,
    children: "Dropdown",
    showLeading: true,
    leadingSlot: <DropdownLeadingSlotPlaceholder />,
    trailingSlot: <DropdownLeadingSlotPlaceholder />
  }
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    empty: false,
    status: "error",
    children: "Dropdown",
    leadingSlot: slotIcon,
    trailingSlot: trailingChevron
  }
}`,...l.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    empty: false,
    disabled: true,
    children: "Dropdown",
    leadingSlot: slotIcon,
    trailingSlot: trailingChevron
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    empty: false,
    expanded: true,
    children: "Dropdown",
    leadingSlot: slotIcon,
    trailingSlot: trailingChevron,
    panelSlot: <DropdownPanelSlotPlaceholder />
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    empty: false,
    fullWidth: true,
    children: "Dropdown",
    leadingSlot: slotIcon,
    trailingSlot: trailingChevron
  }
}`,...d.parameters?.docs?.source}}};const y=["Empty","WithIcons","WithPlaceholderSlots","Error","Disabled","Expanded","FullWidth"];export{s as Disabled,n as Empty,l as Error,i as Expanded,d as FullWidth,a as WithIcons,t as WithPlaceholderSlots,y as __namedExportsOrder,f as default};
