.DEFAULT_GOAL := run

run:
	bb -cp src -m app.gen $(ARGS)
