import{g as p,j as e,S as o,h as S}from"./iframe-2pycKTdO.js";import"./preload-helper-PPVm8Dsz.js";function u(){return e.jsx("svg",{width:12,height:12,viewBox:"0 0 24 24","aria-hidden":!0,style:{flexShrink:0,color:"var(--color-main-primary)"},children:e.jsx("circle",{cx:"12",cy:"12",r:"6",fill:"currentColor"})})}const h={title:"InputSection",component:p,tags:["autodocs"],decorators:[g=>e.jsx("div",{style:{maxWidth:480,width:"100%"},children:e.jsx(g,{})})],argTypes:{leadingSlot:{control:!1,table:{category:"Content",type:{summary:"ReactNode"}}},trailingSlot:{control:!1,table:{category:"Content",type:{summary:"ReactNode"}}},contentSlot:{control:!1,table:{category:"Content",type:{summary:"ReactNode"}}},label:{table:{category:"Content"}},leadingColor:{table:{category:"Appearance"}},trailingColor:{table:{category:"Appearance"}},showLabel:{table:{category:"Layout"}},hasContentSlot:{table:{category:"Layout"}},collapsible:{table:{category:"Layout"}},expanded:{table:{category:"Layout"}},defaultExpanded:{table:{category:"Layout"}},onExpandedChange:{control:!1,table:{category:"Layout"}}}},n={name:"With SomeIcon leading (2xs)",args:{label:"Section title",leadingSlot:e.jsx(o,{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"2xs"})}},t={name:"SomeIcon leading (filled)",args:{label:"Filled style",leadingSlot:e.jsx(o,{iconName:"formatting-pencil-alt",iconStyle:"fill",iconSize:"2xs"})}},l={name:"Leading + trailing (2xs)",args:{label:"Section title",leadingSlot:e.jsx(o,{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"2xs"}),trailingSlot:e.jsx(o,{iconName:"interface-search",iconStyle:"outline",iconSize:"2xs"})}},i={args:{label:"Accent leading",leadingSlot:e.jsx(o,{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"2xs"}),leadingColor:"var(--color-intent-accent)"}},r={name:"With custom leading slot",args:{label:"Custom leading",leadingSlot:e.jsx(u,{})}},s={args:{label:"Notes",leadingSlot:e.jsx(o,{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"2xs"}),contentSlot:e.jsx("textarea",{rows:4,placeholder:"Type here…",style:{width:"100%",boxSizing:"border-box",resize:"vertical",padding:"var(--spacing-padding-3)",borderRadius:"var(--radius-lg)",border:"1px solid var(--color-border-weak)",fontFamily:"var(--font-family-sans)",fontSize:"var(--size-3)"}})}},c={args:{label:"No icon",showLabel:!0}},d={args:{label:"Header row only",leadingSlot:e.jsx(o,{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"2xs"}),hasContentSlot:!1}},m={args:{showLabel:!1,hasContentSlot:!0,contentSlot:e.jsx(S,{})}},a={args:{label:"Collapsible section",collapsible:!0,defaultExpanded:!0,leadingSlot:e.jsx(o,{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"2xs"}),contentSlot:e.jsx("p",{style:{margin:0,color:"var(--color-main-secondary)"},children:"Body content is hidden when collapsed."})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "With SomeIcon leading (2xs)",
  args: {
    label: "Section title",
    leadingSlot: <SomeIcon iconName="formatting-pencil-alt" iconStyle="outline" iconSize="2xs" />
  }
}`,...n.parameters?.docs?.source},description:{story:'`SomeIcon` `iconSize="2xs"` matches the section label-row slots. Requires network.',...n.parameters?.docs?.description}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "SomeIcon leading (filled)",
  args: {
    label: "Filled style",
    leadingSlot: <SomeIcon iconName="formatting-pencil-alt" iconStyle="fill" iconSize="2xs" />
  }
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Leading + trailing (2xs)",
  args: {
    label: "Section title",
    leadingSlot: <SomeIcon iconName="formatting-pencil-alt" iconStyle="outline" iconSize="2xs" />,
    trailingSlot: <SomeIcon iconName="interface-search" iconStyle="outline" iconSize="2xs" />
  }
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Accent leading",
    leadingSlot: <SomeIcon iconName="formatting-pencil-alt" iconStyle="outline" iconSize="2xs" />,
    leadingColor: "var(--color-intent-accent)"
  }
}`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "With custom leading slot",
  args: {
    label: "Custom leading",
    leadingSlot: <DemoLeadingIcon />
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Notes",
    leadingSlot: <SomeIcon iconName="formatting-pencil-alt" iconStyle="outline" iconSize="2xs" />,
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
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: "No icon",
    showLabel: true
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Header row only",
    leadingSlot: <SomeIcon iconName="formatting-pencil-alt" iconStyle="outline" iconSize="2xs" />,
    hasContentSlot: false
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    showLabel: false,
    hasContentSlot: true,
    contentSlot: <InputSectionSlotPlaceholder />
  }
}`,...m.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Collapsible section",
    collapsible: true,
    defaultExpanded: true,
    leadingSlot: <SomeIcon iconName="formatting-pencil-alt" iconStyle="outline" iconSize="2xs" />,
    contentSlot: <p style={{
      margin: 0,
      color: "var(--color-main-secondary)"
    }}>
        Body content is hidden when collapsed.
      </p>
  }
}`,...a.parameters?.docs?.source},description:{story:"Expand/collapse trailing control fades in while the pointer is inside the section (pointer enter/leave on shell). Requires network.",...a.parameters?.docs?.description}}};const x=["WithLeadingIcon","LeadingIconFilled","WithLeadingAndTrailing","WithLeadingColor","WithCustomLeadingSlot","WithCustomContent","LabelOnly","WithoutContentSlot","WithoutLabel","Collapsible"];export{a as Collapsible,c as LabelOnly,t as LeadingIconFilled,s as WithCustomContent,r as WithCustomLeadingSlot,l as WithLeadingAndTrailing,i as WithLeadingColor,n as WithLeadingIcon,d as WithoutContentSlot,m as WithoutLabel,x as __namedExportsOrder,h as default};
