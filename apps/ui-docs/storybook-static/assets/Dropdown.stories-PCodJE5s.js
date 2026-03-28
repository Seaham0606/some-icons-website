import{j as e}from"./jsx-runtime-u17CrQMm.js";import{D as S,S as m,a as h,L as u,b as y,c as g}from"./index-DPhOrz7g.js";import"./iframe-DLYWTf-H.js";import"./preload-helper-PPVm8Dsz.js";const r=e.jsx(m,{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"md",padding:"2"}),o=e.jsx(m,{iconName:"arrow-down-triangle",iconStyle:"fill",iconSize:"md",padding:"2"}),L={title:"Dropdown",component:S,tags:["autodocs"],decorators:[p=>e.jsx("div",{style:{maxWidth:320,width:"100%"},children:e.jsx(p,{})})],argTypes:{leadingSlot:{control:!1},trailingSlot:{control:!1},panelSlot:{control:!1},status:{control:"select",options:["default","error"]}}},n={name:"Empty (no leading)",args:{empty:!0,children:"Dropdown",trailingSlot:o}},a={name:"Leading + trailing (SomeIcon)",args:{empty:!1,children:"Dropdown",leadingSlot:r,trailingSlot:o}},t={name:"Slot placeholders",args:{empty:!1,children:"Dropdown",showLeading:!0,leadingSlot:e.jsx(g,{}),trailingSlot:e.jsx(g,{})}},l={args:{empty:!1,status:"error",children:"Dropdown",leadingSlot:r,trailingSlot:o}},s={args:{empty:!1,disabled:!0,children:"Dropdown",leadingSlot:r,trailingSlot:o}},i={args:{empty:!1,expanded:!0,children:"Dropdown",leadingSlot:r,trailingSlot:o,panelSlot:e.jsx(h,{})}},d={args:{empty:!1,fullWidth:!0,children:"Dropdown",leadingSlot:r,trailingSlot:o}},c={name:"Legacy (single-button shell)",render:p=>e.jsx(y,{...p}),args:{empty:!1,expanded:!0,children:"Legacy dropdown",leadingSlot:r,trailingSlot:o,panelSlot:e.jsx(u,{})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Legacy (single-button shell)",
  render: args => <LegacyDropdown {...args} />,
  args: {
    empty: false,
    expanded: true,
    children: "Legacy dropdown",
    leadingSlot: slotIcon,
    trailingSlot: trailingChevron,
    panelSlot: <LegacyDropdownPanelSlotPlaceholder />
  }
}`,...c.parameters?.docs?.source}}};const P=["Empty","WithIcons","WithPlaceholderSlots","Error","Disabled","Expanded","FullWidth","LegacyV1"];export{s as Disabled,n as Empty,l as Error,i as Expanded,d as FullWidth,c as LegacyV1,a as WithIcons,t as WithPlaceholderSlots,P as __namedExportsOrder,L as default};
