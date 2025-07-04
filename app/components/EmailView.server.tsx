
'use server';

import { render } from '@react-email/render';
import { Html } from '@react-email/html';

export async function renderEmail(html: string): Promise<string> {
  const emailComponent = <Html dangerouslySetInnerHTML={{ __html: html }} />;
  return render(emailComponent);
}
