import ColorPicker from './ColorPicker.jsx';
import OptionRow from './OptionRow.jsx';
import {
  SPIKE_OPTIONS, EYE_OPTIONS, MOUTH_OPTIONS, HEAD_OPTIONS, HELD_OPTIONS,
  SPIKE_LABELS, EYE_LABELS, MOUTH_LABELS, HEAD_LABELS, HELD_LABELS,
} from '../data/layers.js';

export default function Customizer({ state, onChange }) {
  const update = (key) => (value) => onChange({ ...state, [key]: value });

  return (
    <div className="customizer">
      <ColorPicker selected={state.color} onChange={update('color')} />
      <OptionRow
        label="Spikes"
        options={SPIKE_OPTIONS}
        labels={SPIKE_LABELS}
        selected={state.spikes}
        onSelect={update('spikes')}
        bodyColor={state.color}
      />
      <OptionRow
        label="Eyes"
        options={EYE_OPTIONS}
        labels={EYE_LABELS}
        selected={state.eyes}
        onSelect={update('eyes')}
        bodyColor={state.color}
      />
      <OptionRow
        label="Mouth"
        options={MOUTH_OPTIONS}
        labels={MOUTH_LABELS}
        selected={state.mouth}
        onSelect={update('mouth')}
        bodyColor={state.color}
      />
      <OptionRow
        label="Head"
        options={HEAD_OPTIONS}
        labels={HEAD_LABELS}
        selected={state.head}
        onSelect={update('head')}
        bodyColor={state.color}
      />
      <OptionRow
        label="Held"
        options={HELD_OPTIONS}
        labels={HELD_LABELS}
        selected={state.held}
        onSelect={update('held')}
        bodyColor={state.color}
      />
    </div>
  );
}
