import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile, useUpdateProfile } from '../../hooks';
import { FormInput, FormTextarea, FormSelect } from '../../components/admin/ui/FormInput';
import { Save, Loader2 } from 'lucide-react';
import type { Profile } from '../../types/database';

export default function ProfileEditor() {
  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<Profile>();

  useEffect(() => {
    if (profile) {
      reset({
        ...profile,
        impact_metrics: JSON.stringify(profile.impact_metrics || [], null, 2),
        philosophy: JSON.stringify(profile.philosophy || [], null, 2),
        fun_facts: (profile.fun_facts || []).join('\n'),
      } as any);
    }
  }, [profile, reset]);

  const onSubmit = (data: any) => {
    try {
      const payload = {
        ...data,
        yoe: Number(data.yoe),
        impact_metrics: typeof data.impact_metrics === 'string' ? JSON.parse(data.impact_metrics) : data.impact_metrics,
        philosophy: typeof data.philosophy === 'string' ? JSON.parse(data.philosophy) : data.philosophy,
        fun_facts: typeof data.fun_facts === 'string' ? data.fun_facts.split('\n').filter(Boolean) : data.fun_facts,
      };
      updateProfile({ id: profile!.id, updates: payload });
    } catch (e) {
      alert('Invalid JSON in one of the fields. Please check your syntax.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Profile Editor</h1>
          <p className="text-slate-400">Update your personal information, tagline, and links.</p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={!isDirty || isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors"
        >
          {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="bg-[#0a1628] border border-indigo-500/10 rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
              placeholder="e.g. John Doe"
            />
            <FormInput
              label="Job Title"
              {...register('title', { required: 'Title is required' })}
              error={errors.title?.message}
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <FormTextarea
            label="Tagline"
            {...register('tagline', { required: 'Tagline is required' })}
            error={errors.tagline?.message}
            placeholder="A short, catchy sentence about what you do."
            rows={2}
          />

          <FormTextarea
            label="Full Bio"
            {...register('bio', { required: 'Bio is required' })}
            error={errors.bio?.message}
            placeholder="Detailed description about your background and experience."
            rows={6}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Availability Status"
              {...register('availability_status')}
              options={[
                { label: 'Open to opportunities', value: 'open' },
                { label: 'Currently busy', value: 'busy' },
                { label: 'Not looking', value: 'closed' },
              ]}
            />
            <FormInput
              label="Location"
              {...register('location', { required: 'Location is required' })}
              error={errors.location?.message}
              placeholder="e.g. San Francisco, CA"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Email Address"
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />
            <FormInput
              label="GitHub URL"
              type="url"
              {...register('github_url')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="LinkedIn URL"
              type="url"
              {...register('linkedin_url')}
            />
            <FormInput
              label="Twitter URL"
              type="url"
              {...register('twitter_url')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Resume URL"
              type="url"
              {...register('resume_url')}
            />
            <FormInput
              label="Years of Experience"
              type="number"
              {...register('yoe', { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-indigo-500/10">
            <h3 className="text-sm font-semibold text-white">Advanced Profile Data</h3>
            
            <FormTextarea
              label="Impact Metrics (JSON Array)"
              {...register('impact_metrics')}
              placeholder='[{"label": "Projects", "value": "30+"}]'
              rows={4}
              className="font-mono text-xs"
            />

            <FormTextarea
              label="Engineering Philosophy (JSON Array)"
              {...register('philosophy')}
              placeholder='[{"title": "Simplicity", "body": "..."}]'
              rows={6}
              className="font-mono text-xs"
            />

            <FormTextarea
              label="Fun Facts (One per line)"
              {...register('fun_facts')}
              placeholder="Ex-guitar player..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Calendar URL"
              type="url"
              {...register('calendar_url')}
              placeholder="e.g. Calendly link"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
