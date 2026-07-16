from django.db import migrations


def drop_orphan_payment_type(apps, schema_editor):
    """
    Drop the leftover ``payment_type`` column if (and only if) it still exists.

    On PostgreSQL (production) migration 0021's ``RemoveField`` was recorded as
    applied but the column was never actually dropped, leaving a NOT NULL column
    that breaks inserts. On SQLite (local dev) the column is already gone, so we
    introspect first and no-op when it is absent.
    """
    connection = schema_editor.connection
    table = 'events_payment'

    with connection.cursor() as cursor:
        existing_columns = [
            col.name for col in connection.introspection.get_table_description(cursor, table)
        ]

    if 'payment_type' not in existing_columns:
        return

    # Only PostgreSQL is expected to reach here; use IF EXISTS defensively.
    if connection.vendor == 'postgresql':
        with connection.cursor() as cursor:
            cursor.execute('ALTER TABLE events_payment DROP COLUMN IF EXISTS payment_type;')
    else:
        with connection.cursor() as cursor:
            cursor.execute('ALTER TABLE events_payment DROP COLUMN payment_type;')


class Migration(migrations.Migration):
    """
    Drop the orphaned ``payment_type`` column that lingers on databases where
    migration 0021 was recorded as applied but the ``RemoveField`` operation
    never actually dropped the column (schema/state drift).

    The column is already absent from the ``Payment`` model, so this migration
    only performs the raw SQL DROP. It carries no ``state_operations`` because
    Django's model state already reflects the field's removal.
    """

    dependencies = [
        ('events', '0021_payment_purpose_and_daraja_fields'),
    ]

    operations = [
        migrations.RunPython(
            drop_orphan_payment_type,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
