import{j as e}from"./jsx-runtime-u17CrQMm.js";import{d as m,S as t,e as S}from"./index-m2GsfvbU.js";import"./iframe-aZuiXQCe.js";import"./preload-helper-PPVm8Dsz.js";function p(){return e.jsx("svg",{width:12,height:12,viewBox:"0 0 24 24","aria-hidden":!0,style:{flexShrink:0,color:"var(--color-main-primary)"},children:e.jsx("circle",{cx:"12",cy:"12",r:"6",fill:"currentColor"})})}const y={title:"InputSection",component:m,tags:["autodocs"],decorators:[d=>e.jsx("div",{style:{maxWidth:480,width:"100%"},children:e.jsx(d,{})})],argTypes:{leadSlot:{control:!1,table:{category:"Content",type:{summary:"ReactNode"}}},contentSlot:{control:!1,table:{category:"Content",type:{summary:"ReactNode"}}},label:{table:{category:"Content"}},leadColor:{table:{category:"Appearance"}},showLabel:{table:{category:"Layout"}},showContentSlot:{table:{category:"Layout"}}}},o={name:"With SomeIcon lead (2xs)",args:{label:"Section title",leadSlot:e.jsx(t,{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"2xs"})}},a={name:"SomeIcon lead (filled)",args:{label:"Filled style",leadSlot:e.jsx(t,{iconName:"formatting-pencil-alt",iconStyle:"fill",iconSize:"2xs"})}},n={args:{label:"Accent lead",leadSlot:e.jsx(t,{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"2xs"}),leadColor:"var(--color-intent-accent)"}},r={name:"With custom lead slot",args:{label:"Custom lead",leadSlot:e.jsx(p,{})}},l={args:{label:"Notes",leadSlot:e.jsx(t,{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"2xs"}),contentSlot:e.jsx("textarea",{rows:4,placeholder:"Type here…",style:{width:"100%",boxSizing:"border-box",resize:"vertical",padding:"var(--spacing-padding-3)",borderRadius:"var(--radius-lg)",border:"1px solid var(--color-border-weak)",fontFamily:"var(--font-family-sans)",fontSize:"var(--size-3)"}})}},s={args:{label:"No icon",showLabel:!0}},c={args:{label:"Header row only",leadSlot:e.jsx(t,{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"2xs"}),showContentSlot:!1}},i={args:{showLabel:!1,showContentSlot:!0,contentSlot:e.jsx(S,{})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "With SomeIcon lead (2xs)",
  args: {
    label: "Section title",
    leadSlot: <SomeIcon iconName="formatting-pencil-alt" iconStyle="outline" iconSize="2xs" />
  }
}`,...o.parameters?.docs?.source},description:{story:'`SomeIcon` `iconSize="2xs"` matches the section label-row lead. Requires network.',...o.parameters?.docs?.description}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "SomeIcon lead (filled)",
  args: {
    label: "Filled style",
    leadSlot: <SomeIcon iconName="formatting-pencil-alt" iconStyle="fill" iconSize="2xs" />
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Accent lead",
    leadSlot: <SomeIcon iconName="formatting-pencil-alt" iconStyle="outline" iconSize="2xs" />,
    leadColor: "var(--color-intent-accent)"
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "With custom lead slot",
  args: {
    label: "Custom lead",
    leadSlot: <DemoLeadIcon />
  }
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Notes",
    leadSlot: <SomeIcon iconName="formatting-pencil-alt" iconStyle="outline" iconSize="2xs" />,
    contentSlot: <textarea rows={4} placeholder="Type here…" style={{
      width: "100%",
      boxSizing: "border-box",
      resize: "vertical",
      padding: "var(--spacing-padding-3)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--color-border-weak)",
      fontFamily: "var(--font-family-sans)",
      fontSize: "var(--size-3)"
    }} />
  }
}`,...l.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "No icon",
    showLabel: true
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Header row only",
    leadSlot: <SomeIcon iconName="formatting-pencil-alt" iconStyle="outline" iconSize="2xs" />,
    showContentSlot: false
  }
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    showLabel: false,
    showContentSlot: true,
    contentSlot: <InputSectionSlotPlaceholder />
  }
}`,...i.parameters?.docs?.source}}};const x=["WithLeadIcon","LeadIconFilled","WithLeadColor","WithCustomLeadSlot","WithCustomContent","LabelOnly","WithoutContentSlot","WithoutLabel"];export{s as LabelOnly,a as LeadIconFilled,l as WithCustomContent,r as WithCustomLeadSlot,n as WithLeadColor,o as WithLeadIcon,c as WithoutContentSlot,i as WithoutLabel,x as __namedExportsOrder,y as default};
