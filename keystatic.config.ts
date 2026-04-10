import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'yasiraboanmar/yasiraboanmar-site',
  },
  ui: {
    brand: {
      name: 'مدونة ياسر الجيادي',
    },
  },
  collections: {
    blog: collection({
      label: 'المقالات',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: {
            label: 'عنوان المقال (عربي)',
            validation: { isRequired: true },
          },
        }),
        titleEn: fields.text({
          label: 'عنوان المقال (إنجليزي)',
          validation: { isRequired: false },
        }),
        description: fields.text({
          label: 'وصف المقال (عربي)',
          multiline: true,
          validation: { isRequired: true },
        }),
        descriptionEn: fields.text({
          label: 'وصف المقال (إنجليزي)',
          multiline: true,
        }),
        pubDate: fields.date({
          label: 'تاريخ النشر',
          validation: { isRequired: true },
        }),
        tags: fields.array(
          fields.text({ label: 'وسم' }),
          {
            label: 'الوسوم',
            itemLabel: (props) => props.fields.value.value || 'وسم',
          }
        ),
        draft: fields.checkbox({
          label: 'مسودة (لا ينشر)',
          defaultValue: false,
        }),
        linkedinPosted: fields.checkbox({
          label: 'تم النشر على LinkedIn',
          defaultValue: false,
        }),
        cover: fields.text({
          label: 'صورة الغلاف (مسار اختياري)',
        }),
        content: fields.mdx({
          label: 'محتوى المقال',
        }),
      },
    }),
  },
});
