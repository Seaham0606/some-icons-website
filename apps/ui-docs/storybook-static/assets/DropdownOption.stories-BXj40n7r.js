import{d as i,j as e,S as d,r as p,C as u,e as m}from"./iframe-2pycKTdO.js";import"./preload-helper-PPVm8Dsz.js";const h={title:"DropdownOption",component:i,tags:["autodocs"],decorators:[s=>e.jsx("div",{style:{width:280,padding:16,background:"var(--color-background-base)"},children:e.jsx(m,{children:e.jsx(s,{})})})]},o={args:{leadingSlot:e.jsx(d,{iconName:"interface-cursor",iconStyle:"outline",iconSize:"sm",padding:"050"}),children:"dropdown",onClick:()=>{}}},r={render:function(){const[l,c]=p.useState(!1);return e.jsx(i,{leadingSlot:e.jsx(d,{iconName:"interface-cursor",iconStyle:"outline",iconSize:"sm",padding:"050"}),onClick:()=>c(t=>!t),trailingSlot:e.jsx(u,{checked:l,onChange:t=>c(t.target.checked),"aria-label":"Selected"}),children:"dropdown"})}},n={args:{...o.args,disabled:!0}},a={args:{...o.args,selected:!0}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    leadingSlot: <SomeIcon iconName="interface-cursor" iconStyle="outline" iconSize="sm" padding="050" />,
    children: "dropdown",
    onClick: () => undefined
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: function WithCheckboxStory() {
    const [on, setOn] = useState(false);
    return <DropdownOption leadingSlot={<SomeIcon iconName="interface-cursor" iconStyle="outline" iconSize="sm" padding="050" />} onClick={() => setOn(v => !v)} trailingSlot={<Checkbox checked={on} onChange={e => setOn(e.target.checked)} aria-label="Selected" />}>
        dropdown
      </DropdownOption>;
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    disabled: true
  }
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    selected: true
  }
}`,...a.parameters?.docs?.source}}};const x=["Default","WithCheckbox","Disabled","Selected"];export{o as Default,n as Disabled,a as Selected,r as WithCheckbox,x as __namedExportsOrder,h as default};
